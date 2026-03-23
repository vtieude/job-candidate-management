import { Types } from "mongoose";
import { JobStatusEnum } from "../../../common/enums";
import { Job } from "../schemas/job.schema";
import { ApiHideProperty } from "@nestjs/swagger";
import { User } from "../../users/schemas/user.schema";

export class JobsDto implements Job {
    createdBy: Types.ObjectId | User;
    @ApiHideProperty()
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