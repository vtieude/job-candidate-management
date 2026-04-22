// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../../common/enums';
import { BaseDoc } from '../../schemas/base.schema';

export enum UserLevel {
  Intern = 'intern',
  Junior = 'junior',
  Middle = 'middle',
  Senior = 'senior',
}

@Schema({ timestamps: true, collection: 'users' })
export class User extends BaseDoc {
  @Prop({ required: true, lowercase: true, trim: true,})
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.Candidate,})
  role!: UserRole;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ trim: true })
  fullName?: string;

  @Prop({ type: [{ type: String, trim: true }], default: [] })
  skills?: string[];

  @Prop()
  phone?: string;

  @Prop({ enum: UserLevel, default: UserLevel.Intern,})
  level?: UserLevel;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

// Optional: explicit indexes (recommended for prod)
UserSchema.index({ email: 1 }, { unique: true });
