import { Get, Route, Tags, Post, Body, Query, Security } from 'tsoa';
import * as jobService from '../services/job.service';
import * as jobCandidateService from '../services/jobCanidate.service';
import * as candidateService from '../services/candidate.service';
import { AssignJobRequest } from '../inputs/job.input';
import { Constants } from '../configs/constant';
import { HttpError } from '../utils/httpError';
import { JobCandidateStatusEnum } from '../configs/enum';

@Route('jobCandidates')
@Tags('JobCandidates')
@Security(Constants.SecurityMethod.JWT)
export class JobCandidateController {

    @Get('/stats')
    public async getAllJobs(@Query() jobId: string): Promise<{ jobId: string, count: number}> {
      const activeCounts =  await jobCandidateService.getAllActiveCandidates(jobId);
      return {jobId, count: activeCounts};
    }

  @Post('/assign')
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
}
