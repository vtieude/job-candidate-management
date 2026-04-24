// src/chatbot/chatbot.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { MessageRole, MessageSender } from '../../common/enums';
import { AiProvider } from './interfaces/ai-provider.abstract';
import { JobsService } from '../jobs/jobs.service';
import { IFindAIJob } from '../../interfaces/job.interface';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectModel(Conversation.name) private convoModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
    private readonly aiProvider: AiProvider,
    private readonly jobService: JobsService,
  ) {}

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

  async getAIChatResponse(userId: string, content: string, conversationId?: string) {
    // 1. Get or Create Conversation
    const conversation = await this.getAIConversaction(userId, conversationId);
    if (!conversation) {
      return {
      conversationId: conversationId,
      message: 'Something went wrong',
    };;
    }
    // 2. Save User Message
    await this.msgModel.create({
      conversationId: conversation._id,
      senderId: userId,
      role: 'user',
      content,
    });

    // 3. Get History for AI Context (Last 10 messages)
    const history = await this.msgModel
      .find({ conversationId: conversation._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    const formattedHistory = history.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 4. Call OpenAI
    const aiContent = await this.aiProvider.generateResponse(formattedHistory);
    // Check if the AI generated search parameters
    if (aiContent.includes("[SEARCH_PARAMS]")) {
      const jsonString = aiContent.split("[SEARCH_PARAMS]")[1].split("[/SEARCH_PARAMS]")[0];
      const filters: IFindAIJob = JSON.parse(jsonString);
      
      // Execute your database logic
      return await this.jobService.findAllWithAI(filters);
    }
    // 5. Save AI Message
    const aiMessage = await this.msgModel.create({
      conversationId: conversation._id,
      senderId: MessageSender.AI_ASSISTANT,
      role: MessageRole.Assistant,
      content: aiContent,
    });

    return {
      conversationId: conversation._id,
      message: aiMessage,
    };
  }
}
