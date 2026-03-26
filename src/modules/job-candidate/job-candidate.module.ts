import { Module } from '@nestjs/common';
import { JobCandidateService } from './job-candidate.service';
import { JobCandidateController } from './job-candidate.controller';
import { JobCandidate, JobCandidateSchema } from './schemas/job-candidate.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../jobs/schemas/job.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobCandidate.name,
        schema: JobCandidateSchema,
      }
    ]),
    NotificationsModule,
  ],
  controllers: [JobCandidateController],
  providers: [JobCandidateService],
  exports: [MongooseModule],
})
export class JobCandidateModule {}
