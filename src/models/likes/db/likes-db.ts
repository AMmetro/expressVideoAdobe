import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export const likeStatusEnum = {
  None: "None",
  Like: "Like",
  Dislike: "Dislike",
  };

export type LikesDB = {
  commentId: string;
  userId: string;
  myStatus: string;
};

export const CommentLikesSchema = new mongoose.Schema<WithId<LikesDB>>({
  userId: { type: String, require: true },
  myStatus: { type: String, require: true },
  commentId: { type: String, require: true },
})


export type PostLikesDB = {
  postId: string;
  userId: string;
  myStatus: string;
  addetAt: Date;
};

export const PostLikesSchema = new mongoose.Schema<WithId<PostLikesDB>>({
  userId: { type: String, require: true },
  myStatus: { type: String, require: true },
  postId: { type: String, require: true },
  addetAt: { type: Date, require: true },
})
  


