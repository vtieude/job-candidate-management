// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { JobStatusEnum } from '../../../common/enums';
import { BaseDoc } from '../../schemas/base.schema';

@Schema({ timestamps: true, collection: 'jobs' })
export class Job extends BaseDoc {
  @Prop({ required: true,  lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  fullName!: string;

  @Prop({ type: [String]})
  skills!: string[];

  @Prop({ default: JobStatusEnum.Open })
  status!: JobStatusEnum;

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
}
export type JobDocument = HydratedDocument<Job>;
export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ email: 1 }, { unique: true });