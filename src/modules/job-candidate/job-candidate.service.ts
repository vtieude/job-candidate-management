import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobCandidateDto } from './dto/create-job-candidate.dto';
import { UpdateJobCandidateDto } from './dto/update-job-candidate.dto';
import { JobCandidate } from './schemas/job-candidate.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CandidateStatusEnum, JobCandidateStatusEnum } from '../../common/enums';

@Injectable()
export class JobCandidateService {
  constructor(
    @InjectModel(JobCandidate.name) private readonly jobCandidateModel: Model<JobCandidate>,
    @InjectModel('Job') private readonly jobModel: Model<any>,
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

    return await this.jobCandidateModel.create({...createJobCandidateDto, user: userId});
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
    const updated = await this.jobCandidateModel.findByIdAndUpdate(
      { _id: id },
      updateJobCandidateDto,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Application not found');
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
    // 1. check job tồn tại
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // 2. check quyền 
    if (job.createdBy.toString() !== userId) {
      throw new BadRequestException('You are not allowed to view this job');
    }

    // 3. Lấy Candidate
    return await this.jobCandidateModel
      .find({ job: new Types.ObjectId(jobId) })
      .populate('user', 'email role')
      .populate('job', 'title')
      .lean();
  }

// CANDIDATE: xem job đã apply
  async getJobsAppliedByUser(userId: string) {
    const jobs = await this.jobCandidateModel
      .find({ user: new Types.ObjectId(userId) })
      .select('job')
      .lean();
    return jobs.filter((job) => job.job).map((job) => job.job.toString());
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
