// src/models/User.ts

import { JobStatusEnum } from "../configs/enum";
import { IJob } from '../schema/job.schema'

export class BaseJobRequest implements IJob {
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