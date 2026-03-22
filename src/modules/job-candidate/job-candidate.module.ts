import { Module } from '@nestjs/common';
import { JobCandidateService } from './job-candidate.service';
import { JobCandidateController } from './job-candidate.controller';
import { JobCandidate, JobCandidateSchema } from './schemas/job-candidate.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../jobs/schemas/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobCandidate.name,
        schema: JobCandidateSchema,
      },
      {
        name: Job.name,
        schema: JobSchema,
      }
    ]),
  ],
  controllers: [JobCandidateController],
  providers: [JobCandidateService],
})
export class JobCandidateModule {}
