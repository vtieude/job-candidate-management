import { IsMongoId, IsEnum } from 'class-validator';
import { JobCandidateStatusEnum } from '../../../common/enums';

export class CreateJobCandidateDto {

  @IsMongoId()
  job: string;

  @IsMongoId()
  user: string;

  @IsEnum(JobCandidateStatusEnum)
  status: JobCandidateStatusEnum;

}
