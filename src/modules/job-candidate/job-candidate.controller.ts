import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards} from '@nestjs/common';
import { JobCandidateService } from './job-candidate.service';
import { CreateJobCandidateDto } from './dto/create-job-candidate.dto';
import { UpdateJobCandidateDto } from './dto/update-job-candidate.dto';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';

@UseGuards(JwtAuthGuard, RolesGuard) //
@Controller('job-candidate')
export class JobCandidateController {
  constructor(private readonly jobCandidateService: JobCandidateService) {}

  @Post()
  @Roles(UserRole.Candidate ) // apply job
  async applyJobs(@Body() createJobCandidateDto: CreateJobCandidateDto, @CurrentUser('userId') userId: string,) {
    return this.jobCandidateService.apllyJobs(createJobCandidateDto, userId );
  }

  // candidate xem job đã apply
  @Get('me')
  @Roles(UserRole.Candidate)
  async getMyApplications(@CurrentUser('userId') userId: string): Promise<string[]> {
    if (!userId) {
      throw new BadRequestException("UserId is missing");
    }
    return await this.jobCandidateService.getJobIdsAppliedByUser(userId);
  }

  @Get()
  @Roles(UserRole.Admin)
  findAll() {
    return this.jobCandidateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobCandidateService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Recruiter)
  updateStatus(@Param('id') id: string, @Body() updateJobCandidateDto: UpdateJobCandidateDto) {
    return this.jobCandidateService.update(id, updateJobCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobCandidateService.remove(id);
  }

  // recruiter xem list candidate theo job
  @Get('job/:jobId')
  @Roles(UserRole.Recruiter)
  getCandidatesByJob(@Param('jobId') jobId: string, @CurrentUser('userId') userId: string,) {
    return this.jobCandidateService.getCandidatesByJob(jobId, userId);
  }

}

