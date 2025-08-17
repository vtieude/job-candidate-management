import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from 'bcryptjs';
import { IBaseTimestamps } from "./base.schema";

export interface IUser extends IBaseTimestamps {
  email: string;
  password: string;
}

export interface UserDoc extends Document, IUser {}


const UserSchema: Schema<UserDoc> = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre<UserDoc>('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

export const User = model < UserDoc > ("User", UserSchema);