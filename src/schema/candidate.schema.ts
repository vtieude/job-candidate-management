import { Document, Schema, model } from "mongoose";
import { CandidateStatusEnum } from "../configs/enum";
import { IBaseTimestamps } from "./base.schema";
import { UserDoc } from "./user.schema";

export interface ICandidate extends IBaseTimestamps {
  email: string;
  fullName: string;
  skills: string[];
  status: CandidateStatusEnum;
}

export interface CandidateDoc extends Document, ICandidate {
  user: UserDoc['_id'] | UserDoc
}


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
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

export const Candidate = model < CandidateDoc > ("Candidate", CandidateSchema);