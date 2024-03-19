import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type SecurityDevicesDB = {
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  tokenCreatedAt: Date;
  deviceId: string;
};

export const SecurityDevicesSchema = new mongoose.Schema<WithId<SecurityDevicesDB>>({
  userId: { type: String, require: true },
  ip: { type: String, require: true },
  title: { type: String, require: true },
  lastActiveDate: { type: Date, require: true },
  tokenCreatedAt: { type: Date, require: true },
})


