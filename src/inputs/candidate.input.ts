// src/models/User.ts

import { CandidateStatusEnum } from "../configs/enum";

export class BaseCandidateRequest {
  email!: string;
  fullName!: string;
  skills!: string[];
  status!: CandidateStatusEnum;
}