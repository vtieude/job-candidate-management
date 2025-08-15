import mongoose, { Schema, Document, model } from "mongoose";

export interface IJob {
  title: string;
  company: string;
  location: string;
}

export interface JobDoc extends Document, IJob {}

const JobSchema: Schema<JobDoc> = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export const Job = model < JobDoc > ("Job", JobSchema);