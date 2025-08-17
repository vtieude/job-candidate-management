import { Get, Route, Tags, Post, Body, Query, Security, Patch, Delete } from 'tsoa';
import { IJob } from '../schema/job.schema';
import * as jobService from '../services/job.service';
import * as jobCandidateService from '../services/jobCanidate.service';
import * as candidateService from '../services/candidate.service';
import { AssignJobRequest, BaseJobRequest } from '../inputs/job.input';
import { Constants } from '../configs/constant';
import { HttpError } from '../utils/httpError';
import { JobCandidateStatusEnum } from '../configs/enum';

@Route('jobs')
@Tags('Jobs')
@Security(Constants.SecurityMethod.JWT)
export class JobController {

  @Get('{jobId}/stats')
  public async getAllJobs(@Query() jobId: string): Promise<{ jobId: string, count: number}> {
    const activeCounts =  await jobCandidateService.getAllActiveCandidates(jobId);
    return {jobId, count: activeCounts};
  }

  @Get('{jobId}')
  public async getJobById(@Query() jobId: string): Promise<IJob | null> {
    return await jobService.getJobById(jobId);
  }

  @Get()
  public async findJob(
    @Query() q?: string,
    @Query() location?: string,
    @Query() minSalary?: number,
    @Query() maxSalary?: number
  ): Promise<IJob[]> {
    return await jobService.searchJob(q, location, minSalary, maxSalary);
  }

  @Post('/{jobId}/assign')
  public async assignJobAndCandidate(@Query() jobId: string, @Body() input: AssignJobRequest): Promise<boolean> {
    const job = await jobService.getJobById(jobId);
    if (!job) {
      throw new HttpError(Constants.HttpStatus.NOT_FOUND, 'Job not found');
    }
    const candidate = await candidateService.getCandidateById(input.candidateId);
    if (!candidate) {
      throw new HttpError(Constants.HttpStatus.NOT_FOUND, 'Candidate not found');
    }
    await jobCandidateService.assingCandidateAndJob(jobId, input.candidateId, JobCandidateStatusEnum.Applied);
    return true;
  }

  @Post('/')
  public async createJob(@Body() input: BaseJobRequest): Promise<IJob> {
    return await jobService.createJob(input);
  }

  @Patch('{jobId}')
  public async updateJob(@Body() input: BaseJobRequest, @Query() jobId: string): Promise<Boolean> {
    const updateJob = await jobService.updateJob( jobId,input);
    return updateJob.modifiedCount >= 1;
  }

  @Delete('{jobId}')
  public async deleteJob(@Query() jobId: string): Promise<Boolean> {
    const updateJob = await jobService.deleteJob( jobId);
    return updateJob.deletedCount >= 1;
  }
}
