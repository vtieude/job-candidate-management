import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { NotificationTypeEnum, NotificationStatusEnum } from '../../../common/enums';
import { BaseDoc } from '../../schemas/base.schema';
import { User } from '../../users/schemas/user.schema';
import { Job } from '../../jobs/schemas/job.schema';
import { JobCandidate } from '../../job-candidate/schemas/job-candidate.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification extends BaseDoc {
  @ApiProperty({ enum: NotificationTypeEnum })
  @Prop({
    type: String,
    enum: NotificationTypeEnum,
    required: true
  })
  type!: NotificationTypeEnum;

  @ApiProperty({ enum: NotificationStatusEnum })
  @Prop({
    type: String,
    enum: NotificationStatusEnum,
    default: NotificationStatusEnum.Unread
  })
  status!: NotificationStatusEnum;

  @ApiProperty()
  @Prop({ required: true })
  title!: string;

  @ApiProperty()
  @Prop({ required: true })
  message!: string;

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId | User;

  @ApiProperty({ type: String, required: false })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender?: Types.ObjectId | User;

  @ApiProperty({ type: String, required: false })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job' })
  job?: Types.ObjectId | Job;

  @ApiProperty({ type: String, required: false })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'JobCandidate' })
  jobCandidate?: Types.ObjectId | JobCandidate;

  @ApiProperty({ required: false })
  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export type NotificationDocument = HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes for efficient queries
NotificationSchema.index({ recipient: 1, status: 1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });