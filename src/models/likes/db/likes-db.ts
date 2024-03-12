import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type LikesDB = {
  commentId: string;
  userId: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

export const likeStatusEnum = {
  None: "None",
  Like: "Like",
  Dislike: "Dislike",
  };
  
export const LikesSchema = new mongoose.Schema<WithId<LikesDB>>({
  likesCount: { type: Number, require: true },
  dislikesCount: { type: Number, require: true },
  userId: { type: String, require: true },
  myStatus: { type: String, require: true },
})


