import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser {
  email: String;
  password: String;
}

export interface UserDoc extends Document, IUser {
  comparePassword(password: string): Promise<boolean>;
}


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
  },
});

// Pre-save hook to hash password
UserSchema.pre<UserDoc>('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export const User = model < UserDoc > ("User", UserSchema);