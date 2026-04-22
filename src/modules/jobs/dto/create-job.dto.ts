import { JobStatusEnum, JobWorkingType } from "../../../common/enums";

export class CreateJobDto {
     
      title!: string;
    
      company!: string;
    
      location!: string;

      salaryMin?: number;
    
      salaryMax?: number;

      skills?: string[];
    
      jobType?: JobWorkingType;
    
      description?: string;
    
      status!: JobStatusEnum;
}
