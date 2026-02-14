import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobCandidateService } from './job-candidate.service';
import { CreateJobCandidateDto } from './dto/create-job-candidate.dto';
import { UpdateJobCandidateDto } from './dto/update-job-candidate.dto';

@Controller('job-candidate')
export class JobCandidateController {
  constructor(private readonly jobCandidateService: JobCandidateService) {}

  @Post()
  create(@Body() createJobCandidateDto: CreateJobCandidateDto) {
    return this.jobCandidateService.create(createJobCandidateDto);
  }

  @Get()
  findAll() {
    return this.jobCandidateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobCandidateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobCandidateDto: UpdateJobCandidateDto) {
    return this.jobCandidateService.update(+id, updateJobCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobCandidateService.remove(+id);
  }
}
