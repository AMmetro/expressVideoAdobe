import { WithId } from 'mongodb';
import mongoose from 'mongoose'

export type SecurityDevicesDB = {
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  tokenCreatedAt: Date;
  deviceId: string;
};

export const DevicesSchema = new mongoose.Schema<WithId<SecurityDevicesDB>>({
  userId:{ type: String, require: true },
  ip: { type: String, require: true },
  title: { type: String, require: true },
  lastActiveDate: { type: Date, require: true },
  tokenCreatedAt: { type: Date, require: true },
  deviceId: { type: String, require: true },
})


