import { Schema, Types, model } from "mongoose";
import { JobCandidateStatusEnum } from "../configs/enum";
import { Job } from "./job.schema";
import { Candidate } from "./candidate.schema";

export interface IJobCandidate {
  job: Types.ObjectId;        // reference to Job
  candidate: Types.ObjectId;  // reference to Candidate
  status: JobCandidateStatusEnum;
}
export interface JobCandidateDoc extends Document, IJobCandidate {}

const JobCandidateSchema: Schema<JobCandidateDoc> = new Schema({
  job: { type: Schema.Types.ObjectId, ref: Job, required: true },
  candidate: { type: Schema.Types.ObjectId, ref: Candidate, required: true },
  status: { type: String, default: JobCandidateStatusEnum.Applied },
}, {
  timestamps: true
});

export const JobCandidate = model < JobCandidateDoc > ("JobCandidate", JobCandidateSchema);