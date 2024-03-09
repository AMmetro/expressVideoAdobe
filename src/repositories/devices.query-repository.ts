import { WithId, ObjectId } from "mongodb";
import { blogsCollection, db, securityDevicesCollection } from "../BD/db";
import { devicesMapper } from "../models/devices/mapper/devices-mapper";
import { OutputDevicesType } from "../models/devices/output/devices.output";
import { SecurityDevicesDB } from "../models/devices/db/devices-db";

// type SortDataType = {
//   searchNameTerm?: string | null,
//   sortBy: string,
//   sortDirection: SortDirection,
//   pageNumber: number,
//   pageSize: number,
// }

export class DevicesQueryRepository {
  static async getByUserId(id: string): Promise<OutputDevicesType[] | null> {
    const devices: WithId<SecurityDevicesDB>[] = await securityDevicesCollection
      .find({ userId: id })
      .toArray();
    if (!devices) {
      return null;
    }
    return devices.map(devicesMapper);
  }

  static async getByDeviceId(id: string): Promise<OutputDevicesType | null> {
    const device: WithId<SecurityDevicesDB> | null = await securityDevicesCollection
      .findOne({ deviceId: id })
    if (!device) {
      return null;
    }
    return devicesMapper(device);
  }
}
