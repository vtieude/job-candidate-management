// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { JobCandidateStatusEnum } from '../../../common/enums';
import { BaseDoc } from '../../schemas/base.schema';
import { Job } from '../../jobs/schemas/job.schema';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true, collection: 'job_candidate' })
export class JobCandidate extends BaseDoc {
  @Prop({ 
    type: String, 
    enum: JobCandidateStatusEnum, 
    default: JobCandidateStatusEnum.Applied // Nên để mặc định là Pending khi mới apply
   })
  status!: JobCandidateStatusEnum;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) 
  user: Types.ObjectId | User; 
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }) 
  job: Types.ObjectId | Job; 
}
export type JobCandidateDocument = HydratedDocument<JobCandidate>;
export const JobCandidateSchema = SchemaFactory.createForClass(JobCandidate);

// chống apply trùng
JobCandidateSchema.index({ user: 1, job: 1 }, { unique: true });