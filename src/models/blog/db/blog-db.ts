import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type BlogDB = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export const BlogDBSchema = new mongoose.Schema<WithId<BlogDB>>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true },
  })