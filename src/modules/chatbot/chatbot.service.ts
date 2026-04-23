// src/chatbot/chatbot.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { MessageSender } from '../../common/enums';
import * as aiProviderInterface from './interfaces/ai-provider.abstract';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectModel(Conversation.name) private convoModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
    @Inject('AI_PROVIDER') private readonly aiProvider: aiProviderInterface.AiProvider,
  ) {}

  async getAIChatResponse(userId: string, content: string, conversationId?: string) {
    // 1. Get or Create Conversation
    let conversation;
    if (conversationId) {
      conversation = await this.convoModel.findById(conversationId);
    } else {
      conversation = await this.convoModel.create({
        participants: [userId, MessageSender.AI_ASSISTANT],
        type: 'ai',
        title: 'AI Assistant'
      });
    }

    if (!conversation) {
        return;
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

    // 5. Save AI Message
    const aiMessage = await this.msgModel.create({
      conversationId: conversation._id,
      senderId: 'AI_ASSISTANT',
      role: 'assistant',
      content: aiContent,
    });

    return {
      conversationId: conversation._id,
      message: aiMessage,
    };
  }
}
