import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { JobsDto } from './dto/jobs.dto';
import { UserRole } from '../../common/enums';
import { Public, Roles } from '../../common/decorators';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(UserRole.Recruiter)
  async create(@Body() createJobDto: CreateJobDto, @CurrentUser('userId') userId: string,): Promise<string> {
    await this.jobsService.create(createJobDto, userId);
    return 'ok';
  }

  @Get()
  @Public() //Authen
  findAll(
    @Query() query: SearchJobDto) {
    return this.jobsService.findAll(query.q, query.location, query.minSalary, query.maxSalary);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string): Promise<JobsDto> {
    
    const job = await this.jobsService.findOne(id);
    return job;
  }

  @Patch(':id')
  @Roles(UserRole.Recruiter)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @CurrentUser('userId') userId: string) {
    return this.jobsService.update(id, updateJobDto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.Recruiter)
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) { // CurrentUser: kiểm tra quyền sở hữu
    return this.jobsService.remove(id, userId);
  }
}
