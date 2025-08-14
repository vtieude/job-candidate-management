import mongoose from "mongoose";

type DBInput = {
  db: string,
};

export const connectDb = async ({ db }: DBInput) => {
  await  mongoose.connect(db, { });
};