import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobsDto } from './dto/jobs.dto';
import { JobCandidateService } from '../job-candidate/job-candidate.service';
import { JobWorkingType, UserRole } from '../../common/enums';
import { IFindAIJob } from '../../interfaces/job.interface';

@Injectable()
export class JobsService {
  JobCandidateModel: any;
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    private readonly jobCandidateService: JobCandidateService,
  ) {}

  async create(createJobDto: CreateJobDto, userId: string) {
    return await this.jobModel.create({
      ...createJobDto,
      createdBy: userId,
    });
  }

  private toDto(job: Job, isApplied = false): JobsDto {
    return {
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      status: job.status,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      description: job.description,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      isApplied,
      skills: job.skills,
      jobType: job.jobType ?? JobWorkingType.FullTime,
      createdBy: job.createdBy,
    };
  }

  async findAllWithAI(aiFilter: IFindAIJob): Promise<JobsDto[]> {
    const filter: any = {};
    const andFilters: any[] = [];

    if (aiFilter.title) {
      andFilters.push({ title: { $regex: aiFilter.title, $options: 'i' } });
    }
    if (aiFilter.company) {
      andFilters.push({ company: { $regex: aiFilter.company, $options: 'i' } });
    }
    if (aiFilter.location) {
      andFilters.push({ location: { $regex: aiFilter.location, $options: 'i' } });
    }
    if (!!aiFilter.minSalary || !!aiFilter.maxSalary) {
      if (aiFilter.minSalary > 0) andFilters.push({ salaryMin: { $gte: aiFilter.minSalary } });
      if (aiFilter.maxSalary > 0) andFilters.push({ salaryMax: { $lte: aiFilter.maxSalary } });
    }
    if (aiFilter.skills && aiFilter.skills.length > 0) {
      // Use $and to ensure the document contains EVERY skill in the list
      andFilters.push(...aiFilter.skills.map(skill => ({
        skills: { 
          $regex: skill, 
          $options: 'i' 
        }
      })));
    }

    if (andFilters.length > 0) {
      filter.$and = andFilters;
    }
    
    const page = Math.max(aiFilter.page ?? 1, 1);
    const limit = aiFilter.limit ?? 10;
    const skip = (page - 1) * limit;
    const jobs = await this.jobModel.find(filter).limit(limit).skip(skip).sort({ createdAt: -1 }).exec();
    return jobs.map((job) => this.toDto(job));
  }

  async findAll(q?: string, location?: string, minSalary?: number, maxSalary?: number, userId?: string): Promise<JobsDto[]> {
    const filter: any = {};
    if (!!q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (!!location) {
      filter.$and = [{ location: { $regex: location, $options: 'i' } }];
    }
    if (!!minSalary || !!maxSalary) {
      filter.$and = filter.$and || [];
      if (minSalary !== undefined) filter.$and.push({ salaryMin: { $gte: minSalary } });
      if (maxSalary !== undefined) filter.$and.push({ salaryMax: { $lte: maxSalary } });
    }

    const jobs = await this.jobModel.find(filter).sort({ createdAt: -1 }).exec();

    if (!userId) return jobs.map((job) => this.toDto(job));

    const appliedJobIds = await this.jobCandidateService.getJobIdsAppliedByUser(userId);
    const appliedJobIdsSet = new Set(appliedJobIds);

    return jobs.map((job) => this.toDto(job, appliedJobIdsSet.has(job._id.toString())));
  }

  async findOne(id: string, userId?: string): Promise<JobsDto> {
    const job = await this.jobModel.findById(id).populate('createdBy', 'email fullName');
    if (!job) throw new NotFoundException('Job not found');

    let isApplied = false;

    if (userId) {
      const appliedJobIds = await this.jobCandidateService.getJobIdsAppliedByUser(userId);
      isApplied = appliedJobIds.includes(id);
    }

    return this.toDto(job, isApplied);
  }

  async update(_id: string, updateJobDto: UpdateJobDto, userId: string, role?: string) {
    const job = await this.jobModel.findById(_id);
    if (!job) throw new NotFoundException('Job not found');
    if (role !== UserRole.Admin && job.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own jobs');
    }
    return await this.jobModel.findByIdAndUpdate({ _id }, updateJobDto, { new: true });
  }

  async remove(_id: string, userId: string, role?: string) {
    const job = await this.jobModel.findById(_id);
    if (!job) throw new NotFoundException('Job not found');
    if (role !== UserRole.Admin && job.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }
    return await this.jobModel.deleteOne({ _id });
  }

  async countAll() {
    return this.jobModel.countDocuments();
  }
}
