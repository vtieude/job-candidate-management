//  await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
import { Document, Schema, model } from "mongoose";
import { UserDoc } from "./user.schema";

export interface IPost {
  title: string;        // reference to Job
  content: string;  // reference to Candidate
}
export interface PostDoc extends Document, IPost {
  author: UserDoc['_id'] | UserDoc;
}

const PostSchema: Schema<PostDoc> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
}, {
  timestamps: true
});

export const Post = model < PostDoc > ("Post", PostSchema);