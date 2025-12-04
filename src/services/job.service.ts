import{ IJob, Job} from "../schema/job.schema"

export const listJob = async() => {
    return await Job.find();
}

export const getJobById = async(_id: string) => {
    return await Job.findById(_id);
}

export const createJob = async(job: IJob) => {
    return await Job.create(job);
}

export const updateJob = async(jobId: string, job: IJob) => {
  return await Job.updateOne({ _id: jobId}, job);
}

export const deleteJob = async(jobId: string) => {
  return await Job.deleteOne({ _id: jobId});
}

export const searchJob = async(q?: string, location?: string, minSalary?: number, maxSalary?: number) => {
  // Text search on title, company, description
  const filter: any = {};
  if (q) {
    filter.$text = { $search: q };
  }
  if (location) {
    filter.$and = [{ location: { $regex: location, $options: "i" } }];
  }
  if (minSalary !== undefined || maxSalary !== undefined) {
    filter.$and = filter.$and || [];
    if (minSalary !== undefined) filter.$and.push({salaryMin: { $gte: minSalary }});
    if (maxSalary !== undefined) filter.$and.push({salaryMax: { $lte: maxSalary }});
  }
  return await Job.find(filter).exec();
}