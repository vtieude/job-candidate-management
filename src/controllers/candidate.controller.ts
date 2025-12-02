import { Get, Route, Tags, Security, Query, Body, Patch, Delete, Post } from 'tsoa';
import * as candidateService from '../services/candidate.service';
import { Constants } from '../configs/constant';
import { ICandidate } from '../schema/candidate.schema';
import { BaseCandidateRequest } from '../inputs/candidate.input';
import { HttpError } from '../utils/httpError';
import { RoleEnum } from '../configs/enum';

@Route('candidates')
@Tags('Candidates')
@Security(Constants.SecurityMethod.JWT, [RoleEnum.Admin, RoleEnum.Recruiter])
export class CandidateController {
  @Get('')
  public async getAllCandidates(): Promise<ICandidate[]> {
    return await candidateService.getAllCandidates();
  }

  @Security(Constants.SecurityMethod.JWT)
  @Get('email')
  public async getCandidateByEmail(@Query() email: string): Promise<ICandidate | null> {
    return await candidateService.getCandidateByEmail(email);
  }

  @Security(Constants.SecurityMethod.JWT, [RoleEnum.Candidate])
  @Post('/')
  public async createCandidate(@Body() input: BaseCandidateRequest): Promise<BaseCandidateRequest> {
    const existCandidate = await candidateService.getCandidateByEmail(input.email);
    if (existCandidate) {
      throw new HttpError(Constants.HttpStatus.CONFLICT, 'Email already in used');
    }
    return await candidateService.createCandidate(input);
  }

  @Patch('')
  public async updateCandidate(@Body() input: BaseCandidateRequest, @Query() candidateId: string): Promise<Boolean> {
    const updateJob = await candidateService.updateCandidate( candidateId, input);
    return updateJob.modifiedCount >= 1;
  }

  @Delete('')
  public async deleteCandidate(@Query() candidateId: string): Promise<Boolean> {
    const updateJob = await candidateService.deleteCandidateById( candidateId);
    return updateJob.deletedCount >= 1;
  }
}
