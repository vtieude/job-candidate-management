// src/models/User.ts

import { CandidateStatusEnum, JobStatusEnum } from "../configs/enum";
import { ICandidate } from "../schema/candidate.schema";

export class BaseCandidateRequest implements ICandidate {
  email!: string;
  fullName!: string;
  skills!: string[];
  status!: CandidateStatusEnum;
}