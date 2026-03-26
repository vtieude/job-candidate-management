import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobCandidateDto } from './dto/create-job-candidate.dto';
import { UpdateJobCandidateDto } from './dto/update-job-candidate.dto';
import { JobCandidate } from './schemas/job-candidate.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CandidateStatusEnum, JobCandidateStatusEnum } from '../../common/enums';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/schemas/user.schema';
import { Job } from '../jobs/schemas/job.schema';
import { JobsDto } from '../jobs/dto/jobs.dto';

@Injectable()
export class JobCandidateService {
  constructor(
    @InjectModel(JobCandidate.name) private readonly jobCandidateModel: Model<JobCandidate>,
    private readonly notificationsService: NotificationsService,
  ) {}

  //Apply job
  async apllyJobs(createJobCandidateDto: CreateJobCandidateDto, userId: string) {

    const exist = await this.jobCandidateModel.findOne({
      job: createJobCandidateDto.job,
      user: userId,
    });

    if (exist) {
      throw new BadRequestException('You have already applied for this job');
    }

    const jobCandidate = await this.jobCandidateModel.create({...createJobCandidateDto, user: userId});

    // Get job details to send notification
    const jobCandidateUser = await this.jobCandidateModel
      .findById(jobCandidate._id)
      .populate('job', 'title createdBy')
      .populate('user', '_id fullName email')
      .lean().exec();
    if (jobCandidateUser && jobCandidateUser.user) {
      const user = jobCandidateUser.user as User;
      const job = jobCandidateUser.job as Job;
      const candidateName =user.fullName || user.email;
        
        // Create notification for recruiter
        await this.notificationsService.createJobApplicationNotification(
          userId,
          job.createdBy._id.toString(),
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
      .populate('job', 'title company')
      .populate('user', 'email name')
      .lean();
  }

  async findOne(id: string) {
    const data = await this.jobCandidateModel
      .findById(id)
      .populate('job')
      .populate('user', 'email name');

      if (!data) {
      throw new NotFoundException('Application not found');
    }

    return data;
  }

  async update(id: string, updateJobCandidateDto: UpdateJobCandidateDto) {
    const jobCandidate = await this.jobCandidateModel
      .findById(id)
      .populate('job', 'title createdBy')
      .populate('user', '_id fullName email');

    if (!jobCandidate) {
      throw new NotFoundException('Application not found');
    }

    const previousStatus = jobCandidate.status;
    
    const updated = await this.jobCandidateModel.findByIdAndUpdate(
      { _id: id },
      updateJobCandidateDto,
      { new: true },
    );

    // Send notification if status changed
    if (updateJobCandidateDto.status && updateJobCandidateDto.status !== previousStatus) {
      const job = jobCandidate.job as any;
      const user = jobCandidate.user as any;
      const candidateId = user._id.toString();
      const recruiterId = job.createdBy.toString();

      switch (updateJobCandidateDto.status) {
        case JobCandidateStatusEnum.Approved:
          await this.notificationsService.createApplicationApprovedNotification(
            candidateId,
            recruiterId,
            job._id.toString(),
            id,
            job.title,
          );
          break;
        case JobCandidateStatusEnum.Rejected:
          await this.notificationsService.createApplicationRejectedNotification(
            candidateId,
            recruiterId,
            job._id.toString(),
            id,
            job.title,
          );
          break;
        case JobCandidateStatusEnum.Interview:
          await this.notificationsService.createInterviewNotification(
            candidateId,
            recruiterId,
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


async assignCandidateAndJob(jobId: string, userId: string, status: JobCandidateStatusEnum){
  const existJobCandidate = await this.jobCandidateModel.find({job: jobId, user: userId, status: status});
  if (existJobCandidate.length > 0) {
    throw new NotFoundException('Candidate already applied');
  }
  return await this.jobCandidateModel.create({
    job: jobId,
    user: userId,
    status
  })
}

// RECRUITER: xem candidate theo job
  async getCandidatesByJob(jobId: string, userId: string) {
    const jobCandidates = await this.jobCandidateModel
      .find({ job: new Types.ObjectId(jobId) })
      .populate('user', 'email role')
      .populate('job', 'title createdBy')
      .lean();
    if (jobCandidates.length === 0) {
      throw new NotFoundException('Job not found');
    }
    const createJobs = jobCandidates[0].job as Job;
    // 2. check quyền 
    if (createJobs.createdBy.toString() !== userId) {
      throw new BadRequestException('You are not allowed to view this job');
    }
    return jobCandidates;
  }

// CANDIDATE: xem job đã apply
  async getJobIdsAppliedByUser(userId: string): Promise<string[]> {
    const jobs = await this.jobCandidateModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
    return jobs.filter((job) => job.job).map((job) => job.job.toString());
  }

  async getJobsAppliedByUser(userId: string): Promise<JobsDto[]> {
    const jobs = await this.jobCandidateModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('job', 'title company location salaryMin salaryMax')
      .select('job status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    return jobs.filter((job) => job.job).map((job) => job.job as unknown as JobsDto);
  }

  async getAllActiveCandidates (jobId: string) {
    const activeCounts = await this.jobCandidateModel.aggregate([{
      $match: { job: new Types.ObjectId(jobId) },
    },
    {
      $lookup: {
        from: "users",        // Candidate collection
        localField: "user",
        foreignField: "_id",
        as: "userDoc"
      }
    },
    { $unwind: "$userDoc" },
    { $match: { "userDoc.status": CandidateStatusEnum.Active } },
    { $count: "activeCount" }
    ])
    console.log(activeCounts);
    return activeCounts[0]?.activeCount || 0;
  }
}
