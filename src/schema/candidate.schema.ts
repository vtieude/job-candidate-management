import { Schema, model } from "mongoose";
import { CandidateStatusEnum } from "../configs/enum";
import { IBaseTimestamps } from "./base.schema";

export interface ICandidate extends IBaseTimestamps {
  email: string;
  fullName: string;
  skills: string[];
  status: CandidateStatusEnum;
}

export interface CandidateDoc extends Document, ICandidate {}


const CandidateSchema: Schema<CandidateDoc> = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
  },
  skills: {
    type: [String]
  },
  status: {
    type: String,
    enum: CandidateStatusEnum,
    default: CandidateStatusEnum.InActive
  }
}, {
  timestamps: true
});

export const Candidate = model < CandidateDoc > ("Candidate", CandidateSchema);