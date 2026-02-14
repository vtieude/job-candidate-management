import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';

export class SearchJobDto extends PartialType(CreateJobDto) {
  q?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
}
