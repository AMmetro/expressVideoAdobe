import { WithId } from "mongodb";
import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { OutputUserType, ResultType } from "../models/user/output/user.output";
import { UserDB } from "../models/user/db/user-db";
import { UserRepository } from "../repositories/user-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { AuthUserInputModel } from "../models/user/input/authUser-input-model";
import { userMapper } from "../models/user/mapper/user-mapper";
import { hashServise, jwtServise } from "../utils/JWTservise";
import { randomUUID } from "crypto";
import { ResultCode } from "../validators/error-validators";
import { AuthServices } from "./authServices";
import { DevicesServices } from "./devicesServices";
import { DevicesQueryRepository } from "../repositories/devices.query-repository";
import { DevicesRepository } from "../repositories/devices-repository";

export class UserServices {
  static async create(
    createUserModel: RequestInputUserType
  ): Promise<OutputUserType | null> {
    const { login, password, email } = createUserModel;
    const passwordSalt = await hashServise.generateSalt();
    const passwordHash = await hashServise.generateHash(password, passwordSalt);
    const newUserModal: UserDB = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      blackListToken: [],
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: new Date().toISOString(),
        isConfirmed: true,
      },
    };
    const newUserId = await UserRepository.createWithOutConfirmation(
      newUserModal
    );
    if (!newUserId) {
      return null;
    }
    const createdUser = await UserQueryRepository.getById(newUserId);
    if (!createdUser) {
      return null;
    }
    // const createdDeviceId = await DevicesServices.createdDevice(newUserId);
    // if (!createdDeviceId) {
    //   return null;
    // }
    return createdUser;

  }

  static async delete(id: string): Promise<Boolean | null> {
    const isUserDeleted = await UserRepository.delete(id);
    return isUserDeleted;
  }

  static async checkCredentials(
    authUserData: AuthUserInputModel
  ): Promise<OutputUserType | null> {
    const userSearchData = {
      login: authUserData.loginOrEmail,
      email: authUserData.loginOrEmail,
    };
    const user: WithId<UserDB> | null =
      await UserQueryRepository.getOneByLoginOrEmail(userSearchData);
    if (!user) {
      return null;
    }

    const userLogInPasswordHash = await hashServise.generateHash(
      authUserData.password,
      user.passwordSalt
    );
    if (user.passwordHash !== userLogInPasswordHash || !user) {
      return null;
    }
    return userMapper(user);
  }

  static async logout(refreshToken: string): Promise<ResultType> {
    const claimantInfo = await jwtServise.getUserFromRefreshToken(refreshToken);
    // const claimantInfo = await AuthServices.getUserFromToken(refreshToken);
    if (!claimantInfo?.userId) {
      return {
        status: ResultCode.Unauthorised,
        errorMessage: "No correct Id in token",
      };
    }
    if (!claimantInfo?.deviceId) {
      return {
        status: ResultCode.Unauthorised,
        errorMessage: "Not user device info in token",
      };
    }
    const device = await DevicesQueryRepository.getByDeviceId(claimantInfo.deviceId);
    if (!device?.deviceId) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Can`t find devices with id:",
      };
    }
    if (device.userId !== claimantInfo.userId) {
      return {
        status: ResultCode.Forbidden,
        errorMessage: "Try to delete the deviceId of other user",
      };
    }
    const isDelete = await DevicesRepository.deleteDeviceById(claimantInfo.deviceId);
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
// -----------------black list----------------------------------------------------------------
    // const isTokenInBlackListAlready = user?.blackListToken?.some(
    //   (blackToken) => blackToken === refreshToken
    // );
    // if (isTokenInBlackListAlready) {
    //   return {
    //     status: ResultCode.Unauthorised,
    //     errorMessage: `Token ${refreshToken} is in black list already`,
    //   };
    // }

    // const userBlackListUpdated = await UserRepository.addTokenToBlackListById(
    //   refreshToken,
    //   userId
    // );
    // if (!userBlackListUpdated) {
    //   return {
    //     status: ResultCode.ServerError,
    //     errorMessage: "Can't write user refresh token to black list",
    //   };
    // }
  // ------------------------------------------------------------------
  }
}
