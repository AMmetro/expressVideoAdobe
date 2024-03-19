import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type RateLimitDB = {
    ip: string,
    URL: string,
    date: Date,
}

export const RateLimitSchema = new mongoose.Schema<WithId<RateLimitDB>>({
    ip: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: Date, require: true },
  })


