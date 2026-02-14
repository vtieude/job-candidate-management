// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CandidateStatusEnum } from '../../../common/enums';
import { BaseDoc } from '../../schemas/base.schema';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true, collection: 'candidates' })
export class Candidate extends BaseDoc {
  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  fullName!: string;

  @Prop({ type: [String]})
  skills!: string[];

  @Prop({ default: CandidateStatusEnum.Active })
  status!: CandidateStatusEnum;

  // Define the relationship
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) 
  user: User; 
}

export type CandidateDocument = HydratedDocument<Candidate>;
export const CandidateSchema = SchemaFactory.createForClass(Candidate);

// Optional: explicit indexes (recommended for prod)
CandidateSchema.index({ email: 1 }, { unique: true });
