import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type commentatorInfoType = { userId: string; userLogin: string;}

export type likesInfoType = {
  likesCount: number;
  dislikesCount: number;
  }

export type CommentDB = {
  content: string;
  postId: string;
  commentatorInfo: commentatorInfoType;
  likesInfo: likesInfoType;
  createdAt: string;
};

export const commentatorInfoChema = new mongoose.Schema<commentatorInfoType>({
  userId: { type: String, require: true },
  userLogin: { type: String, require: true },
})

export const likesInfoChema = new mongoose.Schema<likesInfoType>({
  likesCount: { type: Number, require: true },
  dislikesCount: { type: Number, require: true },
})


export const CommentSchema = new mongoose.Schema<WithId<CommentDB>>({
  content: { type: String, require: true },
  postId: { type: String, require: true },
  commentatorInfo: { type: commentatorInfoChema, require: true },
  likesInfo: { type: likesInfoChema, require: true },
  createdAt: { type: String, require: true },
})
