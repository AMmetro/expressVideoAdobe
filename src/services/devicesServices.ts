import { randomUUID } from "crypto";
import { DevicesQueryRepository } from "../repositories/devices.query-repository";
import {
  CuttedOutputDevicesType,
} from "../models/devices/output/devices.output";
import { Result, ResultCode } from "../validators/error-validators";
import { SecurityDevicesModel } from "../BD/db";
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
        lastActiveDate: device.lastActiveDate.toISOString(),
        title: device.title,
        // userId: device.userId,
      };
    });

    return {
      status: ResultCode.Success,
      data: cuttedUserDevices,
    };
  }

  static async createdDevice(
    loginUser: OutputUserType,
    userAgent: string,
    userIp: string
  ): Promise<{ newAT: string; newRT: string } | null> {
    const newDeviceId = randomUUID();
    const accessToken = await jwtServise.createAccessTokenJWT(
      loginUser,
      newDeviceId
    );
    const refreshToken = await jwtServise.createRefreshTokenJWT(
      loginUser,
      newDeviceId
    );
    const decodedRefreshToken = await jwtServise.getUserFromRefreshToken(
      refreshToken
    );
    const newDevices = {
      userId: loginUser.id,
      deviceId: newDeviceId,
      ip: userIp,
      title: userAgent,
      lastActiveDate: new Date(decodedRefreshToken!.exp * 1000),
      tokenCreatedAt: new Date(decodedRefreshToken!.iat * 1000),
    };
    // const createdDeviceId = await SecurityDevicesModel.insertOne(
    //   newDevices
    // );
    const createdDeviceId = await SecurityDevicesModel.create(
      newDevices
    );
    if (!createdDeviceId) {
      return null;
    }
    return { newAT: accessToken, newRT: refreshToken };
  }

  static async deleteDevicesById(
    userId: string,
    deviceId: string,
  ): Promise<any | string> {
    const device = await DevicesQueryRepository.getByDeviceId(deviceId);
    if (!device?.deviceId) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Can`t find devices with id:" + deviceId,
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

  static async isTokenIatEqualDeviceIat(
    deviceId: string,
    RefreshTokenIat: number,
  ): Promise<Result<boolean>> {
    const device = await DevicesQueryRepository.getByDeviceId(deviceId);
    if (!device) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Token device IAT is not exist",
      };
    }
    if (device.tokenCreatedAt !== new Date(RefreshTokenIat)) {
      return {
        status: ResultCode.Forbidden,
        errorMessage: "Token device IAT is belong to another device",
      };
    }
    return {
      status: ResultCode.Success,
      data: true,
    };
  }

  static async updateDevicesTokens(
    deviceId: string,
    deviceLastActiveDate: Date,
    tokenCreatedAt: Date
  ): Promise<any | string> {
    const updateDevices = await DevicesRepository.refreshDeviceTokens(
      deviceId,
      deviceLastActiveDate,
      tokenCreatedAt,
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
