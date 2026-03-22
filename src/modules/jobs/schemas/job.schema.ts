// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { JobStatusEnum } from '../../../common/enums';
import { BaseDoc } from '../../schemas/base.schema';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true, collection: 'jobs' })
export class Job extends BaseDoc {

  // recruiter tạo job
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User
  
  @Prop()
  title: string;

  @Prop()
  company: string;

  @Prop()
  location: string;

  @Prop()
  salaryMin?: number;

  @Prop()
  salaryMax?: number;

  @Prop()
  description?: string;

  @Prop({ default: JobStatusEnum.Open })
  status!: JobStatusEnum;
}
export type JobDocument = HydratedDocument<Job>;
export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ email: 1 }, { unique: true });