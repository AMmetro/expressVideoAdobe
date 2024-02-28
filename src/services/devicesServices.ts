import { randomUUID } from "crypto";
import { DevicesQueryRepository } from '../repositories/devices.query-repository';
import { OutputDevicesType } from '../models/devices/output/devices.output';
import { Result, ResultCode } from '../validators/error-validators';
import { securityDevicesCollection } from "../BD/db";

export class DevicesServices {

  static async getUsersDevices(userId: string): Promise<Result<OutputDevicesType[]>> {
    const userDevices = await DevicesQueryRepository.getByUserId(userId);   
    if (!userDevices) {
      return {
        status: ResultCode.NotFound,
          errorMessage: "Not found devices for user with id: userId" ,
          }
    }
    return {
      status: ResultCode.Success,
      data: userDevices,
    };
  }

  static async createdDevice(newUserId: string): Promise<string> {
    const deviceId = randomUUID();
    const newDevices = {
      userId: newUserId,
      deviceId: deviceId,
      ip: "NOT ",
      title: "NOT",
      lastActiveDate: "string",
    }
    const newDevicesId = await securityDevicesCollection.insertOne(newDevices);
    return newDevicesId.insertedId.toString();   
  }
 

  // static async delete(id: string): Promise<Boolean | null> {
  //   const isPostdeleted = await PostRepository.delete(id);
  //   return isPostdeleted;
  // }
  

}
