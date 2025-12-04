import { Types } from "mongoose";
import { JobCandidate, IJobCandidate } from "../schema/jobCandidate.schema";
import { CandidateStatusEnum, JobCandidateStatusEnum } from "../configs/enum";
import { HttpError } from "../utils/httpError";
import { Constants } from "../configs/constant";


export const getAllActiveCandidates = async (jobId: string): Promise<number> => {
  const activeCounts = await JobCandidate.aggregate([{
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

export const assignCandidateAndJob = async (jobId: string, candidateId: string, status: JobCandidateStatusEnum) => {
  const existJobCandidate = await JobCandidate.find({job: jobId, candidate: candidateId, status: status});
  if (existJobCandidate) {
    throw new HttpError(Constants.HttpStatus.CONFLICT, 'Candidate already applied');
  }
  await JobCandidate.create({
    job: jobId,
    candidate: candidateId,
    status
  })
}