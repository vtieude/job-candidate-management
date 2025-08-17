import { Candidate, ICandidate } from "../schema/candidate.schema";


export const getAllCandiates = async () => {
  return await Candidate.find();
}

export const getCandidateByEmail = async(email: string) => {
  return await Candidate.findOne({ email });
}

export const getCandidateById = async(id: string) => {
  return await Candidate.findById(id);
}

export const deleteCandidateById = async(candidateId: string) => {
  return await Candidate.deleteOne({_id: candidateId});
}
export const createCandidate = async(candidate: ICandidate) => {
    return await Candidate.create(candidate);
}

export const updateCandidate = async(candidateId: string, candidate: ICandidate) => {
return await Candidate.updateOne({ _id: candidateId}, candidate);
}