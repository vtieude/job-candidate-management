// src/assistant/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Conversation } from './conversation.schema';
import { MessageRole } from '../../../common/enums';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId!: Types.ObjectId | Conversation;

  @Prop({ required: true, default: MessageRole.User })
  role!: MessageRole; // 'user' for human, 'assistant' for AI

  @Prop({ required: true })
  senderId!: string;

  @Prop({ required: true })
  content!: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
