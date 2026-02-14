// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { JobCandidateStatusEnum } from '../../../common/enums';
import { BaseDoc } from '../../schemas/base.schema';
import { Job } from '../../jobs/schemas/job.schema';
import { Candidate } from '../../candidates/schemas/candidate.schema';

@Schema({ timestamps: true, collection: 'job_candidate' })
export class JobCandidate extends BaseDoc {
  @Prop({ default: JobCandidateStatusEnum.Interview })
  status!: JobCandidateStatusEnum;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }) 
  candidate: Types.ObjectId | Candidate; 
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }) 
  job: Types.ObjectId | Job; 
}
export type JobCandidateDocument = HydratedDocument<JobCandidate>;
export const JobCandidateSchema = SchemaFactory.createForClass(JobCandidate);

