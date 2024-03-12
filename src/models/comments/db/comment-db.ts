import mongoose from 'mongoose'
import { WithId } from 'mongodb'


export type commentatorInfoType = { userId: string; userLogin: string;}
export type CommentDB = {
  content: string;
  postId: string;
  commentatorInfo: commentatorInfoType
  createdAt: string;
};

export const commentatorInfoChema = new mongoose.Schema<commentatorInfoType>({
  userId: { type: String, require: true },
  userLogin: { type: String, require: true },
})


export const CommentSchema = new mongoose.Schema<WithId<CommentDB>>({
  content: { type: String, require: true },
  postId: { type: String, require: true },
  commentatorInfo: { type: commentatorInfoChema, require: true },
  createdAt: { type: String, require: true },
})
