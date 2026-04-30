// src/chatbot/chatbot.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { MessageRole, MessageSender, UserRole } from '../../common/enums';
import { AiProvider } from './interfaces/ai-provider.abstract';
import { JobsService } from '../jobs/jobs.service';
import { UsersService } from '../users/users.service';
import { UserChatResponseDto } from './dto/aiChatResponse.dto';
import { MessageDto } from './dto/message.dto';
import { JobsDto } from '../jobs/dto/jobs.dto';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectModel(Conversation.name) private convoModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
    private readonly aiProvider: AiProvider,
    private readonly jobService: JobsService,
    private readonly userService: UsersService
  ) {}

  private toDto(message: Message): MessageDto {
    return {
      conversationId: message.conversationId.toString(),
      senderId: message.senderId,
      content: message.content,
      role: message.role,
      createdAt: message.createdAt
    };
  }

  async getAIConversaction(userId: string, conversationId?: string) {
     if (conversationId) {
      return await this.convoModel.findById(conversationId);
    } else {
      return await this.convoModel.create({
        participants: [userId, MessageSender.AI_ASSISTANT],
        type: 'ai',
        title: 'AI Assistant'
      });
    }
  }

  async getAIChatResponse(
    userId: string, 
    content: string, 
    userRole: UserRole, 
    conversationId?: string
  ): Promise<UserChatResponseDto> {
    // 1. Get/Create Conversation & Save User Message
    const conversation = await this.getAIConversaction(userId, conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');
    
    await this.msgModel.create({
      conversationId: conversation._id,
      senderId: userId,
      role: MessageRole.User,
      content,
    });
  
    // 2. Token Saving: Handle simple greetings locally
    if (this.isSmallTalk(content)) {
      return this.handleSmallTalk(conversation._id);
    }
  
    // 3. Process with AI
    return this.processAIResponse(conversation._id, userRole);
  }
  
  /** 
   * Private helper to detect if a message is just a greeting 
   */
  private isSmallTalk(content: string): boolean {
    const greetingRegex = /^(hi|hello|xin chào|chào|chào bạn|hey|tạm biệt|cảm ơn|thanks)$/i;
    return greetingRegex.test(content.trim());
  }
  
  /**
   * Quick response for small talk to save AI costs
   */
  private async handleSmallTalk(conversationId: Types.ObjectId): Promise<UserChatResponseDto> {
    const text = "Xin chào! Tôi có thể giúp gì cho bạn trong việc tìm kiếm hôm nay?";
    const aiMessage = await this.msgModel.create({
      conversationId: conversationId,
      senderId: MessageSender.AI_ASSISTANT,
      role: MessageRole.Assistant,
      content: text,
    });
  
    return {
      content: text,
      conversationId: conversationId.toString(),
      messageDto: this.toDto(aiMessage),
      jobDtos: [],
      userDtos: []
    };
  }
  
  /**
   * Main AI logic split into a cleaner flow
   */
  private async processAIResponse(conversationId: Types.ObjectId, userRole: UserRole): Promise<UserChatResponseDto> {
    // Get history - capped at 8 messages to save tokens
    const history = await this.msgModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(8)
      .exec();
  
    const formattedHistory = history.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  
    const aiContent = await this.aiProvider.generateResponse(formattedHistory, userRole);
    
    let userDtos: UserDto[] = [];
    let jobDtos: JobsDto[] = [];
  
    // Execute Database Search if AI provided params
    if (aiContent.searchParams) {
      if (userRole === UserRole.Candidate) {
        jobDtos = await this.jobService.findAllWithAI(aiContent.searchParams);
      } else {
        userDtos = await this.userService.findAllWithAI(aiContent.searchParams);
      }
    }
  
    const aiMessage = await this.msgModel.create({
      conversationId,
      senderId: MessageSender.AI_ASSISTANT,
      role: MessageRole.Assistant,
      content: aiContent.aiResponse,
    });
  
    return {
      content: aiContent.rawText,
      conversationId: conversationId.toString(),
      messageDto: this.toDto(aiMessage),
      jobDtos,
      userDtos
    };
  }
  
}
