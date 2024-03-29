import { WithId, ObjectId } from "mongodb";
import { SecurityDevicesModel } from "../BD/db";
import { devicesMapper } from "../models/devices/mapper/devices-mapper";
import { OutputDevicesType } from "../models/devices/output/devices.output";
import { SecurityDevicesDB } from "../models/devices/db/devices-db";


export class DevicesQueryRepository {
  static async getByUserId(id: string): Promise<OutputDevicesType[] | null> {
    const devices: WithId<SecurityDevicesDB>[] = await SecurityDevicesModel
      .find({ userId: id })
      .lean();
    if (!devices) {
      return null;
    }
    return devices.map(devicesMapper);
  }

  static async getByDeviceId(id: string): Promise<OutputDevicesType | null> {
    const device: WithId<SecurityDevicesDB> | null = await SecurityDevicesModel
      .findOne({ deviceId: id })
    if (!device) {
      return null;
    }
    return devicesMapper(device);
  }
}
