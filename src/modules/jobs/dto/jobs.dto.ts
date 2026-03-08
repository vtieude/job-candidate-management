import { Types } from "mongoose";
import { JobStatusEnum } from "../../../common/enums";
import { Job } from "../schemas/job.schema";
import { ApiHideProperty } from "@nestjs/swagger";

export class JobsDto implements Job {
    @ApiHideProperty()
    email: string;
    fullName: string;
    skills: string[];
    status: JobStatusEnum;
    title: string;
    company: string;
    location: string;
    salaryMin?: number | undefined;
    salaryMax?: number | undefined;
    description?: string | undefined;
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    
}