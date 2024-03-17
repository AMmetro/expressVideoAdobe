import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type LikesDB = {
  commentId: string;
  userId: string;
  myStatus: string;
  addetAt: Date;
};

export const likeStatusEnum = {
  None: "None",
  Like: "Like",
  Dislike: "Dislike",
  };
  
export const LikesSchema = new mongoose.Schema<WithId<LikesDB>>({
  userId: { type: String, require: true },
  myStatus: { type: String, require: true },
  commentId: { type: String, require: true },
  addetAt: { type: Date, require: true },
})


export type PostLikesDB = {
  commentId: string;
  userId: string;
  myStatus: string;
  addetAt: Date;
};
  


