import { MongoMemoryServer } from 'mongodb-memory-server';
import * as jobService from '../services/job.service';
import mongoose from 'mongoose';
import { JobStatusEnum } from '../configs/enum';

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('JobService Integration', () => {
  it('should create and find a job by text search', async () => {
    await jobService.createJob({
      title: 'Backend Developer',
      company: 'Acme Corp',
      description: 'Work on backend systems',
      location: 'NY',
      salaryMax: 2000,
      salaryMin: 1000,
      status: JobStatusEnum.Open
    });

    const jobs = await jobService.searchJob( 'Backend');
    expect(jobs.length).toBe(1);
    expect(jobs[0].title).toBe('Backend Developer');
  });
});