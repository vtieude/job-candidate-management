// src/models/User.ts

import { JobStatusEnum } from "../configs/enum";

export class BaseJobRequest  {
  title!: string;

  company!: string;

  location!: string;

  status!: JobStatusEnum;

  salaryMin?: number;

  salaryMax?: number;

  description?: string;
}

export class AssignJobRequest {
  candidateId!: string
}