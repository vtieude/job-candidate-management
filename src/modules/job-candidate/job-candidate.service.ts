import { Injectable, NotFoundException } from '@nestjs/common';
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
  create(createJobCandidateDto: CreateJobCandidateDto) {
    return 'This action adds a new jobCandidate';
  }

  findAll() {
    return `This action returns all jobCandidate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobCandidate`;
  }

  update(id: number, updateJobCandidateDto: UpdateJobCandidateDto) {
    return `This action updates a #${id} jobCandidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobCandidate`;
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
