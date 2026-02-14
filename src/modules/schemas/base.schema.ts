// src/database/mongo/base.schema.ts
import { Types } from 'mongoose';

// Do not use @Schema here; apply timestamps at child schema or globally
export abstract class BaseDoc {
  _id!: Types.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;
}
