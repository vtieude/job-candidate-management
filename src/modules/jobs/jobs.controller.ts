import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { JobsDto } from './dto/jobs.dto';
import { UserRole } from '../../common/enums';
import { Public, Roles } from '../../common/decorators';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto): Promise<string> {
    await this.jobsService.create(createJobDto);
    return 'ok';
  }

  @Get()
  @Public() //Authen
  findAll(
    @Query() query: SearchJobDto) {
    return this.jobsService.findAll(query.q, query.location, query.minSalary, query.maxSalary);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobsDto> {
    
    const job = await this.jobsService.findOne(id);
    if (job) {
      return job;
    }
    throw new NotFoundException('Job not found')
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
