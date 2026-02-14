import { PartialType } from '@nestjs/swagger';
import { CreateJobCandidateDto } from './create-job-candidate.dto';

export class UpdateJobCandidateDto extends PartialType(CreateJobCandidateDto) {}
