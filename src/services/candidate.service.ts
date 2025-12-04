import { Candidate, ICandidate } from "../schema/candidate.schema";
import { IUser, UserDoc } from "../schema/user.schema";


export const getAllCandidates = async () => {
  return await Candidate.find();
}

export const getCandidateByEmail = async(email: string) => {
   const candidate = await Candidate.findOne({email}).populate('user');
  if(candidate) {
    const user = candidate.user as UserDoc;
    console.log(user.email)
  }
  return await Candidate.findOne({ email });
}

export const getCandidateById = async(id: string) => {
  return await Candidate.findById(id);
}

export const deleteCandidateById = async(candidateId: string) => {
  return await Candidate.deleteOne({_id: candidateId});
}
export const createCandidate = async(candidate: ICandidate, userId: string) => {
    return await Candidate.create({...candidate, user: userId});
}

export const updateCandidate = async(candidateId: string, candidate: ICandidate) => {
return await Candidate.updateOne({ _id: candidateId}, candidate);
}