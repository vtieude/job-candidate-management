import { IPost, Post } from "../schema/post.schema";

export const createPost = async(post: IPost) => {
    return await Post.create(post);
}