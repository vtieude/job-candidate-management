import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateJobCandidateDto } from './create-job-candidate.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { JobCandidateStatusEnum } from '../../../common/enums';

export class UpdateJobCandidateDto extends PartialType(CreateJobCandidateDto) {}

export class RecruiterUpdateJobCandidateDto extends PartialType(CreateJobCandidateDto) {
  @ApiPropertyOptional({ enum: JobCandidateStatusEnum })
  @IsOptional()
  @IsEnum(JobCandidateStatusEnum)
  status?: JobCandidateStatusEnum;
}
