import { randomUUID } from "crypto";
import { DevicesQueryRepository } from "../repositories/devices.query-repository";
import { CuttedOutputDevicesType, OutputDevicesType } from "../models/devices/output/devices.output";
import { Result, ResultCode } from "../validators/error-validators";
import { securityDevicesCollection } from "../BD/db";
import { jwtServise } from "../utils/JWTservise";
import { OutputUserType } from "../models/user/output/user.output";
import { DevicesRepository } from "../repositories/devices-repository";
import { AuthServices } from "./authServices";

export class DevicesServices {
  static async getUsersDevices(
    userId: string
  ): Promise<Result<CuttedOutputDevicesType[]>> {
    const userDevices = await DevicesQueryRepository.getByUserId(userId);
    if (!userDevices) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found devices for user with id: " + userId,
      };
    }

    const cuttedUserDevices = userDevices.map((device) => {
      return {
        deviceId: device.deviceId,
        ip: device.ip,
        lastActiveDate: device.lastActiveDate,
        title: device.title,
      };
    });
    return {
      status: ResultCode.Success,
      data: cuttedUserDevices,
    };
  }

  static async createdDevice(
    newUser: OutputUserType,
    userAgent: string
  ): Promise<{ newAT: string; newRT: string } | null> {
    const newDeviceId = randomUUID();
    const accessToken = await jwtServise.createAccessTokenJWT(
      newUser,
      newDeviceId
    );
    const refreshToken = await jwtServise.createRefreshTokenJWT(
      newUser,
      newDeviceId
    );
    const decodedRefreshToken = await jwtServise.getUserFromRefreshToken(
      refreshToken
    );
    const newDevices = {
      userId: newUser.id,
      deviceId: newDeviceId,
      ip: "1234567890",
      title: userAgent,
      lastActiveDate: decodedRefreshToken!.exp,
      tokenCreatedAt: decodedRefreshToken!.iat,
    };
    const createdDeviceId = await securityDevicesCollection.insertOne(
      newDevices
    );
    if (!createdDeviceId) {
      return null;
    }
    // return createdDeviceId.insertedId.toString();
    return { newAT: accessToken, newRT: refreshToken };
  }

  static async deleteDevicesById(
    userId: string,
    deviceId: string
  ): Promise<any | string> {
    const device = await DevicesQueryRepository.getByDeviceId(deviceId);
    if (!device) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Cant find devices with id:" + deviceId,
      };
    }
    if (device.userId !== userId) {
      return {
        status: ResultCode.Forbidden,
        errorMessage: "Try to delete the deviceId of other user",
      };
    }
    const isDelete = await DevicesRepository.deleteDeviceById(deviceId);
    if (!isDelete) {
      return {
        status: ResultCode.Conflict,
        errorMessage: "Delete data base error",
      };
    }
    return {
      status: ResultCode.Success,
      data: true,
    };
  }

  static async deleteAllOtherDevices(
    userId: string,
    deviceId: string
  ): Promise<any | string> {
    const deleteDevices = await DevicesRepository.deleteDevicesExeptCurrent(
      deviceId,
      userId
    );
    if (!deleteDevices) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Cant find devices for delete",
      };
    }
    return {
      status: ResultCode.Success,
      data: true,
    };
  }

  static async updateDevicesLastActiveDate(
    deviceId: string,
    deviceLastActiveDate: number
  ): Promise<any | string> {
    const updateDevices = await DevicesRepository.refreshDevicesLastActiveDate(
      deviceId,
      deviceLastActiveDate
    );
    if (!updateDevices) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Cant update devices lastActiveDate field",
      };
    }
    return {
      status: ResultCode.Success,
      data: true,
    };
  }
}
