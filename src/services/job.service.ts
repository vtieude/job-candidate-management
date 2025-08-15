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
