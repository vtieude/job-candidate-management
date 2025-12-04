import { Get, Route, Tags, Security, Query, Body, Request, Patch, Delete, Post } from 'tsoa';
import * as candidateService from '../services/candidate.service';
import { Constants } from '../configs/constant';
import { ICandidate } from '../schema/candidate.schema';
import { BaseCandidateRequest } from '../inputs/candidate.input';
import { HttpError } from '../utils/httpError';
import { RoleEnum } from '../configs/enum';
import * as express from 'express';
import { IAuthPayload } from '../interfaces';

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

  /**
   * Required  candidate role
   */
  @Security(Constants.SecurityMethod.JWT, [RoleEnum.Candidate])
  @Post('/')
  public async createCandidate(@Request() req: express.Request, @Body() input: BaseCandidateRequest): Promise<BaseCandidateRequest> {
    const existCandidate = await candidateService.getCandidateByEmail(input.email);
    if (existCandidate) {
      throw new HttpError(Constants.HttpStatus.CONFLICT, 'Email already in used');
    }
    const userProfile = (req as any).user as IAuthPayload;
    return await candidateService.createCandidate(input, userProfile.id);
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
