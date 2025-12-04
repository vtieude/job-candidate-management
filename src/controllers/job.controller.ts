import { Get, Route, Tags, Post, Body, Query, Request, Security, Patch, Delete } from 'tsoa';
import { IJob } from '../schema/job.schema';
import * as jobService from '../services/job.service';
import { BaseJobRequest } from '../inputs/job.input';
import { Constants } from '../configs/constant';
import * as express from 'express';
import { IAuthPayload } from '../interfaces';

@Route('jobs')
@Tags('Jobs')
@Security(Constants.SecurityMethod.JWT)
export class JobController {

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

  @Post('/')
  public async createJob(@Request() req: express.Request, @Body() input: BaseJobRequest): Promise<IJob> {
    const userProfile = (req as any).user as IAuthPayload;
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
