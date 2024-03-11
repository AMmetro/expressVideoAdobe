import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type PostDB = {
    title: string,
    shortDescription: string,
    content: string,
    blogName: string,
    blogId: string,
    createdAt: string,
}

export const PostSchema = new mongoose.Schema<WithId<PostDB>>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogName: { type: String, require: true },
    blogId: { type: String, require: true },
    createdAt: { type: String, require: true },
  })





