import { WithId } from "mongodb";
import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { OutputUserType, ResultType } from "../models/user/output/user.output";
import { UserDB } from "../models/user/db/user-db";
import { UserRepository } from "../repositories/user-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { AuthUserInputModel } from "../models/user/input/authUser-input-model";
import bcrypt from "bcrypt";
import { userMapper } from "../models/user/mapper/user-mapper";
import { hashServise } from "../utils/JWTservise";
import { randomUUID } from "crypto";
import { ResultCode } from "../validators/error-validators";

export class UserServices {

  static async create(
    createUserModel: RequestInputUserType
  ): Promise<OutputUserType | null> {
    const { login, password, email } = createUserModel;
    const passwordSalt = await bcrypt.genSalt(10);
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
    const newUserId = await UserRepository.createWithOutConfirmation(newUserModal);
    if (!newUserId) {
      return null;
    }
    const createdUser = await UserQueryRepository.getById(newUserId);
    if (!createdUser) {
      return null;
    }
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
      login:authUserData.loginOrEmail,
      email:authUserData.loginOrEmail}
    const user: WithId<UserDB> | null = await UserQueryRepository.getOneByLoginOrEmail(userSearchData);
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

  static async addTokenBlackList(
    refreshToken: string,
    userId: string
  ): Promise<ResultType> {
    const userUpdated = await UserRepository.addOldTokenBlackListById(refreshToken, userId);
    if (!userUpdated) {
      return {
        status: ResultCode.ServerError,
        errorMessage: "Can't update user refresh token black list",
      };
    }
    return {
      status: ResultCode.Success,
      data: true,
    };
  }





}
