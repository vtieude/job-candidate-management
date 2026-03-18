import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { JobCandidateService } from './job-candidate.service';
import { CreateJobCandidateDto } from './dto/create-job-candidate.dto';
import { UpdateJobCandidateDto } from './dto/update-job-candidate.dto';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('job-candidate')
export class JobCandidateController {
  constructor(private readonly jobCandidateService: JobCandidateService) {}

  @Post()
  @Roles(UserRole.Candidate ) // apply job
  applyJobs(@Body() createJobCandidateDto: CreateJobCandidateDto, @CurrentUser('userId') userId: string,) {
    return this.jobCandidateService.create({
      ...createJobCandidateDto,
      user: userId,
    });
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
  update(@Param('id') id: string, @Body() updateJobCandidateDto: UpdateJobCandidateDto) {
    return this.jobCandidateService.update(id, updateJobCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobCandidateService.remove(id);
  }

  // recruiter xem list candidate theo job
  @Get('job/:jobId')
  @Roles(UserRole.Recruiter)
  getCandidatesByJob(@Param('jobId') jobId: string) {
    return this.jobCandidateService.getCandidatesByJob(jobId);
  }

  // candidate xem job đã apply
  @Get('me')
  @Roles(UserRole.Candidate)
  getMyApplications(@CurrentUser('userId') userId: string) {
    return this.jobCandidateService.getByUser(userId);
  }
}

