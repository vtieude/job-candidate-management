import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { JobCandidateService } from './job-candidate.service';
import { CreateJobCandidateDto } from './dto/create-job-candidate.dto';
import { RecruiterUpdateJobCandidateDto } from './dto/update-job-candidate.dto';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('job-candidate')
export class JobCandidateController {
  constructor(private readonly jobCandidateService: JobCandidateService) {}

  @Post()
  @Roles(UserRole.Candidate)
  async applyJobs(@Body() createJobCandidateDto: CreateJobCandidateDto, @CurrentUser('userId') userId: string) {
    return this.jobCandidateService.applyJobs(createJobCandidateDto, userId);
  }

  @Get('me')
  @Roles(UserRole.Candidate)
  async getMyApplications(@CurrentUser('userId') userId: string): Promise<string[]> {
    if (!userId) {
      throw new BadRequestException('UserId is missing');
    }
    return await this.jobCandidateService.getJobIdsAppliedByUser(userId);
  }

  @Get('my-applications')
  @Roles(UserRole.Candidate)
  async getHistoryApplied(@CurrentUser('userId') userId: string) {
    return await this.jobCandidateService.getHistoryApplied(userId);
  }

  @Get('admin/overview')
  @Roles(UserRole.Admin)
  getAdminApplicationOverview() {
    return this.jobCandidateService.getAdminApplicationOverview();
  }

  @Get()
  @Roles(UserRole.Admin)
  findAll() {
    return this.jobCandidateService.findAll();
  }

  @Get('job/:jobId')
  @Roles(UserRole.Recruiter)
  getCandidatesByJob(@Param('jobId') jobId: string, @CurrentUser('userId') userId: string) {
    return this.jobCandidateService.getCandidatesByJob(jobId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobCandidateService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Recruiter)
  updateStatus(
    @Param('id') id: string,
    @Body() updateJobCandidateDto: RecruiterUpdateJobCandidateDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.jobCandidateService.update(id, updateJobCandidateDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobCandidateService.remove(id);
  }
}
