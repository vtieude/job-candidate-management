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
  ) {}
  async create(createJobCandidateDto: CreateJobCandidateDto) {

    const exist = await this.jobCandidateModel.findOne({
      job: createJobCandidateDto.job,
      candidate: createJobCandidateDto.candidate,
    });

    if (exist) {
      throw new BadRequestException('Candidate already applied this job');
    }

    return await this.jobCandidateModel.create(createJobCandidateDto);
  }

  async findAll() {
    return await this.jobCandidateModel
      .find()
      .populate('job')
      .populate('candidate')
      .lean();
  }

  async findOne(id: string) {
    return await this.jobCandidateModel
      .findById(id)
      .populate('job')
      .populate('candidate');
  }

  async update(id: string, updateJobCandidateDto: UpdateJobCandidateDto) {
    return await this.jobCandidateModel.updateOne(
      { _id: id },
      updateJobCandidateDto,
    );
  }

  async remove(id: string) {
    return await this.jobCandidateModel.deleteOne({ _id: id });
  }


async assignCandidateAndJob(jobId: string, candidateId: string, status: JobCandidateStatusEnum){
  const existJobCandidate = await this.jobCandidateModel.find({job: jobId, candidate: candidateId, status: status});
  if (existJobCandidate) {
    throw new NotFoundException('Candidate already applied');
  }
  await this.jobCandidateModel.create({
    job: jobId,
    candidate: candidateId,
    status
  })
}

  async getAllActiveCandidates (jobId: string) {
    const activeCounts = await this.jobCandidateModel.aggregate([{
      $match: { job: new Types.ObjectId(jobId) },
    },
    {
      $lookup: {
        from: "candidates",        // Candidate collection
        localField: "candidate",
        foreignField: "_id",
        as: "candidateDoc"
      }
    },
    { $unwind: "$candidateDoc" },
    { $match: { "candidateDoc.status": CandidateStatusEnum.Active } },
    { $count: "activeCount" }
    ])
    console.log(activeCounts);
    return activeCounts[0]?.activeCount || 0;
  }
}
