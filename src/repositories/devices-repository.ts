import { ObjectId } from "mongodb";
import { postsCollection, securityDevicesCollection } from "../BD/db";
import {
  RequestInputPostType,
  UpdateInputPostType,
} from "../models/post/input/updateposts-input-model";
export class DevicesRepository {
  static async deleteDevicesExeptCurrent(
    deviceId: string,
    userId: string
  ): Promise<Boolean> {
    const deleteDevice = await securityDevicesCollection.deleteMany({
      deviceId: { $ne: deviceId },
      userId: userId,
    });
    return !!deleteDevice.deletedCount;
  }

  static async deleteDeviceById(deviceId: string): Promise<Boolean> {
    const deleteDevice = await securityDevicesCollection.deleteOne({
      deviceId: deviceId,
    });
    return !!deleteDevice.deletedCount;
  }

  static async refreshDevicesLastActiveDate(
    deviceId: string,
    deviceLastActiveDate: number
  ): Promise<Boolean> {
    const updateDevice = await securityDevicesCollection.updateOne(
      { deviceId: deviceId },
      { $set: { lastActiveDate: deviceLastActiveDate } }
    );
    return !!updateDevice.modifiedCount;
  }
}