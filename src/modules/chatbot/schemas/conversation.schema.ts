// src/assistant/schemas/conversation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { BaseDoc } from '../../schemas/base.schema';
import { ConversationType } from '../../../common/enums';
import { User } from '../../users/schemas/user.schema';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation extends BaseDoc {
  @Prop({ default: 'AI Support Chat' })
  title!: string;

  @Prop({ type: [{ type: String }], required: true })
  participants!: string[]

  @Prop({ default: ConversationType.AI })
  type!: ConversationType

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId | User

  @Prop({ default: 'AI Support Chat' })
  lastMessage!: string // For quick preview in Admin list

  @Prop({ default: false })
  isResolved!: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ participants: 1 });
