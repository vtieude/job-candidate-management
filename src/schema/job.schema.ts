import mongoose, { Schema, Document, model, Types } from "mongoose";
import { JobStatusEnum } from "../configs/enum";
import { IBaseTimestamps } from "./base.schema";
import { UserDoc } from "./user.schema";

export interface IJob extends IBaseTimestamps {
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  status: JobStatusEnum;
}

export interface JobDoc extends Document, IJob {
  recruiter: UserDoc['_id']
}

const JobSchema: Schema<JobDoc> = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: JobStatusEnum,
    required: true,
    default: JobStatusEnum.Open
  },
  salaryMin: {
    type: Number,
  },
  salaryMax: {
    type: Number,
  },
  description: {
    type: String,
  },
  recruiter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});
JobSchema.index({title: "text", company: "text", description: "text"})
export const Job = model < JobDoc > ("Job", JobSchema);