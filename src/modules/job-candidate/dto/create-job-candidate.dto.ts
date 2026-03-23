import { IsMongoId, IsEnum, IsOptional } from 'class-validator';
import { JobCandidateStatusEnum } from '../../../common/enums';

export class CreateJobCandidateDto {

  @IsMongoId()
  job: string;

  @IsOptional()
  @IsEnum(JobCandidateStatusEnum)
  status: JobCandidateStatusEnum;

}
