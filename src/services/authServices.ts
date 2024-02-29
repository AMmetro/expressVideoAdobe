import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { Result, ResultCode } from "../validators/error-validators";
import { hashServise, jwtServise } from "../utils/JWTservise";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserRepository } from "../repositories/user-repository";
import { emailAdaper } from "../utils/emailAdaper";
import { DevicesServices } from "./devicesServices";
import { UserServices } from "./userServices";
import { AuthUserInputModel } from "../models/user/input/authUser-input-model";
import { JWTDecodedType, ResultType } from "../models/user/output/user.output";

export class AuthServices {
  static async checkAcssesToken(authRequest: string): Promise<any> {
    const token = authRequest.split(" ");
    const authMethod = token[0];
    if (authMethod !== "Bearer") {
      return {
        status: ResultCode.Unauthorised,
        errorMessage: "auth method is not Bearer",
      };
    }
    const userId = await jwtServise.getUserIdByAcssToken(token[1]);
    if (userId) {
      const user = await UserQueryRepository.getById(userId);
      if (!user) {
        return {
          status: ResultCode.Unauthorised,
          errorMessage: "Not found user with id " + userId,
        };
      }
      return {
        status: ResultCode.Success,
        data: user,
      };
    }
    return {
      status: ResultCode.Unauthorised,
      errorMessage: "JWT is broken",
    };
  }

  static async registrationUserWithConfirmation(
    registrationData: RequestInputUserType
  ): Promise<any | null> {
    const { login, password, email } = registrationData;
    const userSearchData = { login: login, email: email };
    const userAllreadyExist = await UserQueryRepository.getOneByLoginOrEmail(
      userSearchData
    );
    if (userAllreadyExist) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "User allready exist",
      };
    }
    const passwordSalt = await hashServise.generateSalt();
    const passwordHash = await hashServise.generateHash(password, passwordSalt);
    const newUser = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      blackListToken: [],
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
    };
    const newUserId = await UserRepository.createWithConfirmation(newUser);
    if (!newUserId) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "Some error",
      };
    }
    const emailInfo = {
      email: newUser.email,
      subject: "confirm Email",
      confirmationCode: newUser.emailConfirmation.confirmationCode,
    };
    await emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return {
      status: ResultCode.Success,
      data: true,
    };
  }

  static async confirmEmail(code: string): Promise<any> {
    const userForConfirmation = await UserQueryRepository.getByConfirmationCode(
      code
    );
    if (!userForConfirmation) {
      return {
        status: ResultCode.ClientError,
        errorMessage: JSON.stringify({
          errorsMessages: [
            {
              message: `Not found user with confirmation code ${code}`,
              field: "code",
            },
          ],
        }),
      };
    }
    if (userForConfirmation.emailConfirmation.isConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage: JSON.stringify({
          errorsMessages: [
            {
              message: `This confirmation code ${code} already been applied`,
              field: "code",
            },
          ],
        }),
      };
    }
    if (userForConfirmation.emailConfirmation.expirationDate < new Date()) {
      return {
        status: ResultCode.ClientError,
        errorMessage: JSON.stringify({
          errorsMessages: [
            { message: `Confirmation code ${code} expired`, field: "code" },
          ],
        }),
      };
    }
    const isConfirmed = await UserRepository.confirmRegistration(
      userForConfirmation.id
    );
    if (!isConfirmed) {
      return {
        status: ResultCode.Conflict,
        errorMessage: `Confirmation code ${code}`,
      };
    }
    // const createdDeviceId = await DevicesServices.createdDevice(userForConfirmation.id);
    // if (!createdDeviceId) {
    //   return {
    //     status: ResultCode.Conflict,
    //     errorMessage:
    //       `Can't create device for user id: ${userForConfirmation.id}`,
    //   };
    // }
    return {
      status: ResultCode.Success,
      data: isConfirmed,
    };
  }

  static async emailResending(email: string): Promise<any> {
    const userSearchData = { email: email, login: " " }; // search by login " " false for all login
    const userForEmailResending =
      await UserQueryRepository.getOneByLoginOrEmail(userSearchData);
    if (!userForEmailResending) {
      return {
        status: ResultCode.ClientError,
        errorMessage: JSON.stringify({
          errorsMessages: [
            { message: `Not found user with ${email}`, field: "email" },
          ],
        }),
      };
    }
    const emailIsConfirmed =
      userForEmailResending.emailConfirmation?.isConfirmed;
    if (emailIsConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "Email is confirmed already",
      };
    }
    const newConfirmationCode = randomUUID();
    const codeUpd = await UserRepository.updateConfirmationCode(
      userForEmailResending._id,
      newConfirmationCode
    );
    if (!codeUpd) {
      return {
        status: ResultCode.ServerError,
        errorMessage: "Som eerror",
      };
    }
    const emailInfo = {
      email: userForEmailResending.email,
      confirmationCode: newConfirmationCode,
      subject: "resending confirmation code",
    };
    emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return {
      status: ResultCode.Success,
      data: true,
    };
  }

  static async refreshToken(token: string): Promise<any> {
    const claimantInfo = await jwtServise.getUserFromRefreshToken(token);
    if (!claimantInfo?.deviceId) {
      return {
        status: ResultCode.Unauthorised,
        errorMessage: "Not user device info in token",
      };
    }
    if (!claimantInfo?.userId) {
      return {
        status: ResultCode.Unauthorised,
        errorMessage: "Not correct id in token",
      };
    }
    const userId = claimantInfo.userId;
    const user = await UserQueryRepository.getById(userId);
    if (!user) {
      return {
        status: ResultCode.Unauthorised,
        errorMessage: "Not found user with id " + userId,
      };
    }
    const isTokenInBlackListAlready = user?.blackListToken?.some(
      (token) => token === token
    );
    if (isTokenInBlackListAlready) {
      return {
        status: ResultCode.Unauthorised,
        errorMessage: `Token ${token} in black list already`,
      };
    }
    const tokenAddedToBlackList = await UserRepository.addTokenToBlackListById(
      token,
      userId
    );
    if (!tokenAddedToBlackList) {
      return {
        status: ResultCode.ServerError,
        errorMessage: `Can't write token to user black list in database`,
      };
    }
    const newAccessToken = await jwtServise.createAccessTokenJWT(
      user,
      claimantInfo.deviceId
    );
    const newRefreshToken = await jwtServise.createRefreshTokenJWT(
      user,
      claimantInfo.deviceId
    );
    return {
      status: ResultCode.Success,
      data: { newAccessToken, newRefreshToken },
    };
  }

  static async loginUser(authData: AuthUserInputModel, userAgent: string): Promise<Result< {newAT: string, newRT: string}>> {
    const authUsers = await UserServices.checkCredentials(authData);
    if (!authUsers) {
      return {
        status: ResultCode.NotFound,
        errorMessage: `Can't login user`,
      };
    }
    const twoTokensWithDeviceId = await DevicesServices.createdDevice(
      authUsers, userAgent
    );
    if (!twoTokensWithDeviceId) {
      return {
        status: ResultCode.Conflict,
        errorMessage: `Can't create new session (with devices) for user`,
      };
    }
    // const accessToken = await jwtServise.createAccessTokenJWT(authUsers, createdDeviceId );
    // const refreshToken = await jwtServise.createRefreshTokenJWT(authUsers, createdDeviceId);
    return {
      status: ResultCode.Success,
      data: {
        newAT: twoTokensWithDeviceId.newAT,
        newRT: twoTokensWithDeviceId.newRT,
      },
    };
  }

  // static async getUserFromToken(token: string): Promise<null | JWTDecodedType> {
  //   const user = await jwtServise.getUserFromRefreshToken(token);
  //   if (!user.userId) {
  //     return null
  //   }
  //   return user
  // }

  // static async getUserFromToken(token: string): Promise<{userId: string, deviceId: string}> {
  //   const user = await jwtServise.getUserFromRefreshToken(token);
  //   const outUser = {userId: user.userId, deviceId: user.deviceId}
  //   return outUser
  // }
}
