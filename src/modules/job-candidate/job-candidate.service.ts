import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobCandidateDto } from './dto/create-job-candidate.dto';
import { UpdateJobCandidateDto } from './dto/update-job-candidate.dto';
import { JobCandidate } from './schemas/job-candidate.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CandidateStatusEnum, JobCandidateStatusEnum } from '../../common/enums';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/schemas/user.schema';
import { Job } from '../jobs/schemas/job.schema';
import { AppliedJobResponseDto } from './dto/job-candidate.dto';

@Injectable()
export class JobCandidateService {
  constructor(
    @InjectModel(JobCandidate.name) private readonly jobCandidateModel: Model<JobCandidate>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private mapApplication(item: any) {
    return {
      id: item._id,
      status: item.status,
      appliedAt: item.createdAt,
    };
  }

  private mapJob(job: any) {
    if (!job) return null;
    return {
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
    };
  }

  private mapUser(user: any) {
    if (!user) return null;
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      skills: user.skills,
      role: user.role,
    };
  }

  async applyJobs(createJobCandidateDto: CreateJobCandidateDto, userId: string) {
    const exist = await this.jobCandidateModel.findOne({
      job: createJobCandidateDto.job,
      user: userId,
    });

    if (exist) {
      throw new BadRequestException('You have already applied for this job');
    }

    const jobCandidate = await this.jobCandidateModel.create({ ...createJobCandidateDto, user: userId });

    const jobCandidateUser = await this.jobCandidateModel
      .findById(jobCandidate._id)
      .populate('job', 'title createdBy')
      .populate('user', '_id fullName email')
      .lean()
      .exec();

    if (jobCandidateUser && jobCandidateUser.user) {
      const user = jobCandidateUser.user as User;
      const job = jobCandidateUser.job as Job;
      const candidateName = user.fullName || user.email;

      await this.notificationsService.createJobApplicationNotification(
        userId,
        (job.createdBy as any)._id?.toString?.() ?? job.createdBy.toString(),
        createJobCandidateDto.job,
        jobCandidate._id.toString(),
        job.title,
        candidateName,
      );
    }

    return jobCandidate;
  }

  async findAll() {
    return await this.jobCandidateModel
      .find()
      .populate('job', 'title company createdBy')
      .populate('user', 'email fullName role')
      .lean();
  }

  async findOne(id: string) {
    const data = await this.jobCandidateModel
      .findById(id)
      .populate('job')
      .populate('user', 'email fullName role');

    if (!data) {
      throw new NotFoundException('Application not found');
    }

    return data;
  }

  async update(id: string, updateJobCandidateDto: UpdateJobCandidateDto, recruiterId?: string) {
    const jobCandidate = await this.jobCandidateModel
      .findById(id)
      .populate('job', 'title createdBy')
      .populate('user', '_id fullName email');

    if (!jobCandidate) {
      throw new NotFoundException('Application not found');
    }

    const job = jobCandidate.job as any;
    if (recruiterId && job.createdBy.toString() !== recruiterId) {
      throw new ForbiddenException('You are not allowed to update this application');
    }

    const previousStatus = jobCandidate.status;

    const updated = await this.jobCandidateModel.findByIdAndUpdate(
      { _id: id },
      updateJobCandidateDto,
      { new: true },
    );

    if (updateJobCandidateDto.status && updateJobCandidateDto.status !== previousStatus) {
      const user = jobCandidate.user as any;
      const candidateId = user._id.toString();
      const ownerId = job.createdBy.toString();

      switch (updateJobCandidateDto.status) {
        case JobCandidateStatusEnum.Approved:
          await this.notificationsService.createApplicationApprovedNotification(
            candidateId,
            ownerId,
            job._id.toString(),
            id,
            job.title,
          );
          break;
        case JobCandidateStatusEnum.Rejected:
          await this.notificationsService.createApplicationRejectedNotification(
            candidateId,
            ownerId,
            job._id.toString(),
            id,
            job.title,
          );
          break;
      }
    }

    return updated;
  }

  async remove(id: string) {
    return await this.jobCandidateModel.deleteOne({ _id: id });
  }

  async getAdminApplicationOverview() {
    const applications = await this.jobCandidateModel
      .find()
      .populate('job', 'title company createdBy location salaryMin salaryMax')
      .populate('user', 'email fullName role skills')
      .sort({ createdAt: -1 })
      .lean();

    return applications.map((item: any) => ({
      _id: item._id.toString(),
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      application: this.mapApplication(item),
      candidate: this.mapUser(item.user),
      job: this.mapJob(item.job),
      recruiterId: item.job?.createdBy?.toString?.() ?? item.job?.createdBy,
    }));
  }

  async assignCandidateAndJob(jobId: string, userId: string, status: JobCandidateStatusEnum) {
    const existJobCandidate = await this.jobCandidateModel.find({ job: jobId, user: userId, status: status });
    if (existJobCandidate.length > 0) {
      throw new NotFoundException('Candidate already applied');
    }
    return await this.jobCandidateModel.create({
      job: jobId,
      user: userId,
      status,
    });
  }

  async getCandidatesByJob(jobId: string, userId: string) {
    const jobCandidates = await this.jobCandidateModel
      .find({ job: new Types.ObjectId(jobId) })
      .populate('user', 'email role fullName skills')
      .populate('job', 'title createdBy')
      .lean();
    if (jobCandidates.length === 0) {
      throw new NotFoundException('Job not found');
    }
    const createJobs = jobCandidates[0].job as Job;
    if (createJobs.createdBy.toString() !== userId) {
      throw new BadRequestException('You are not allowed to view this job');
    }
    return jobCandidates.map((item) => ({
      _id: item._id,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      application: this.mapApplication(item),
      candidate: this.mapUser(item.user),
    }));
  }

  async getJobIdsAppliedByUser(userId: string): Promise<string[]> {
    const jobs = await this.jobCandidateModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
    return jobs.map((job) => job.job.toString());
  }

  async getHistoryApplied(userId: string): Promise<AppliedJobResponseDto[]> {
    const jobs = await this.jobCandidateModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('job', 'title company location salaryMin salaryMax')
      .select('job status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    return jobs
      .filter((job) => job.job !== null && job.job !== undefined)
      .map((job) => ({ application: this.mapApplication(job), job: this.mapJob(job.job) as any }));
  }

  async getAllActiveCandidates(jobId: string) {
    const activeCounts = await this.jobCandidateModel.aggregate([
      {
        $match: { job: new Types.ObjectId(jobId) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDoc',
        },
      },
      { $unwind: '$userDoc' },
      { $match: { 'userDoc.status': CandidateStatusEnum.Active } },
      { $count: 'activeCount' },
    ]);
    return activeCounts[0]?.activeCount || 0;
  }
}
