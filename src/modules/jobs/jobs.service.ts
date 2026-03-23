import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
  async create(createJobDto: CreateJobDto, userId: string) {
    return await this.jobModel.create ({
      ...createJobDto,
      createdBy: userId,
    });
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
    const job = await this.jobModel.findById(id).populate('createdBy', 'name email');
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(_id: string, updateJobDto: UpdateJobDto, userId: string) {
    const job = await this.findOne(_id);
    // Kiểm tra nếu không phải chủ sở hữu thì không được sửa
    if (job.createdBy['_id'].toString() !== userId) {
      throw new ForbiddenException('You can only update your own jobs');
    }
    return await this.jobModel.findByIdAndUpdate({_id}, updateJobDto, { new: true});
  }

  async remove(_id: string, userId: string) {
    const job = await this.findOne(_id);
    // Kiểm tra nếu không phải chủ sở hữu thì không được xóa
    if (job.createdBy['_id'].toString() !== userId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }
    return await this.jobModel.deleteOne({ _id});
  }
}
