import { ApiProperty, PartialType } from "@nestjs/swagger";
import { JobStatusEnum, JobWorkingType } from "../../../common/enums";
import { Job } from "../schemas/job.schema";
import { Types } from "mongoose";

export class JobsDto  extends PartialType(Job){
  _id!: Types.ObjectId;
  title!: string;

  company!: string;

  location!: string;

  salaryMin?: number;

  salaryMax?: number;

  skills?: string[];

  jobType?: JobWorkingType;

  description?: string;

  status!: JobStatusEnum;
  
  @ApiProperty({ required: false })
  isApplied?: boolean; 
}
