import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobsDto } from './dto/jobs.dto';
import { JobCandidateService } from '../job-candidate/job-candidate.service';
import { UserRole } from '../../common/enums';

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

  private toDto(job: any, isApplied = false): JobsDto {
    return {
      _id: job._id.toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      status: job.status,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      description: job.description,
      createdAt: job.createdAt?.toISOString?.() ?? job.createdAt,
      updatedAt: job.updatedAt?.toISOString?.() ?? job.updatedAt,
      isApplied,
      createdBy: job.createdBy?._id?.toString?.() ?? job.createdBy?.toString?.() ?? job.createdBy,
    };
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
