// src/assistant/schemas/conversation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDoc } from '../../schemas/base.schema';
import { ConversationType } from '../../../common/enums';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation extends BaseDoc {
  @Prop({ default: 'AI Support Chat' })
  title!: string;

  // recruiter tạo job
  @Prop({ type: [{ type: String }], required: true })
  participants!: string[]

  @Prop({ default: ConversationType.AI })
  type!: ConversationType

  @Prop({ default: false })
  isResolved!: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ participants: 1 });
