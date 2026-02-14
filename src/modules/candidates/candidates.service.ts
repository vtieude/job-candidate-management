import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate, CandidateDocument } from './schemas/candidate.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private readonly candidateModel: Model<CandidateDocument>,
  ) {}
  async create(createCandidateDto: CreateCandidateDto) {
    const existCandidate = await this.getCandidateByEmail(createCandidateDto.email);
    if (existCandidate) {
      throw new BadRequestException('Email already in used');
    }
    return this.candidateModel.create(createCandidateDto);
  }

  findAll() {
    return `This action returns all candidates`;
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto) {
    return await this.candidateModel.updateOne({_id: id}, updateCandidateDto);
  }

  async getCandidateByEmail(email: string){
    const candidate = await this.candidateModel.findOne({email}).populate('user');
   if(candidate) {
     const user = candidate.user;
     console.log(user.email)
   }
   return candidate;
 }
 
 async getCandidateById (id: string) {
   return await this.candidateModel.findById(id);
 }
 
 async deleteCandidateById(candidateId: string){
   return await this.candidateModel.deleteOne({_id: candidateId});
 }
}
