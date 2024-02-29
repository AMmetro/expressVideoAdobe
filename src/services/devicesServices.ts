import { randomUUID } from "crypto";
import { DevicesQueryRepository } from '../repositories/devices.query-repository';
import { OutputDevicesType } from '../models/devices/output/devices.output';
import { Result, ResultCode } from '../validators/error-validators';
import { securityDevicesCollection } from "../BD/db";
import { jwtServise } from "../utils/JWTservise";
import { OutputUserType } from "../models/user/output/user.output";

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

  static async createdDevice(newUser: OutputUserType): Promise<{newAT: string, newRT: string} | null> {
    const newDeviceId = randomUUID();
    const accessToken = await jwtServise.createAccessTokenJWT(newUser, newDeviceId );
    const refreshToken = await jwtServise.createRefreshTokenJWT(newUser, newDeviceId);
    const decodedRefreshToken = await jwtServise.getUserFromRefreshToken(refreshToken)
    const newDevices = {
      userId: newUser.id,
      deviceId: newDeviceId,
      ip: "NOT ",
      title: "NOT",
      lastActiveDate: decodedRefreshToken!.exp,
      tokenCreatedAt: decodedRefreshToken!.iat, 
    }
    const createdDeviceId = await securityDevicesCollection.insertOne(newDevices);
    if (!createdDeviceId){
      return null
    }
    // return createdDeviceId.insertedId.toString();   
    return {newAT: accessToken, newRT: refreshToken} 
  }
 

  // static async delete(id: string): Promise<Boolean | null> {
  //   const isPostdeleted = await PostRepository.delete(id);
  //   return isPostdeleted;
  // }
  

}
