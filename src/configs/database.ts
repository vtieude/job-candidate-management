import mongoose, { Schema } from "mongoose";

type DBInput = {
  db: string,
};

export const connectDb = async ({ db }: DBInput) => {
  return await  mongoose.connect(db, { });
};