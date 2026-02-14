import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
  ) {}
  create(createJobDto: CreateJobDto) {
    return 'This action adds a new job';
  }

  async findAll(q?: string, location?: string, minSalary?: number, maxSalary?: number) {
    // Text search on title, company, description
    const filter: any = {};
    if (!!q) {
      filter.$text = { $search: q };
    }
    if (!!location) {
      filter.$and = [{ location: { $regex: location, $options: "i" } }];
    }
    if (!!minSalary || !!maxSalary) {
      filter.$and = filter.$and || [];
      if (minSalary !== undefined) filter.$and.push({salaryMin: { $gte: minSalary }});
      if (maxSalary !== undefined) filter.$and.push({salaryMax: { $lte: maxSalary }});
    }
    console.log(q)
    return await this.jobModel.find(filter).exec();
  }

  async findOne(id: string) {
    return await this.jobModel.findById(id);
  }

  async update(_id: string, updateJobDto: UpdateJobDto) {
    return await this.jobModel.updateOne({_id}, updateJobDto);
  }

  async remove(_id: string) {
    return await this.jobModel.deleteOne({ _id});
  }
}
