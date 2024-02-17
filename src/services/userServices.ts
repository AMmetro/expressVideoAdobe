import { WithId } from "mongodb";
import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { OutputUserType } from "../models/user/output/user.output";
import { UserDB } from "../models/user/db/user-db";
import { UserRepository } from "../repositories/user-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { AuthUserInputModel } from "../models/user/input/authUser-input-model";
import bcrypt from "bcrypt";
import { userMapper } from "../models/user/mapper/user-mapper";

export class UserServices {
  static async _generateHash(password: string, paswordSalt: string) {
    const hash = await bcrypt.hash(password, paswordSalt);
    return hash;
  }

  static async create(
    createUserModel: RequestInputUserType
  ): Promise<OutputUserType | null> {
    const { login, password, email } = createUserModel;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newUserModal: UserDB = {
      login: login,
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
      email: email,
      createdAt: new Date().toISOString(),
    };

    const newUserId = await UserRepository.create(newUserModal);
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
    const user: WithId<UserDB> | null = await UserQueryRepository.getOneForAuth(
      authUserData.loginOrEmail
    );
    if (!user) {
      return null;
    }
    const requestedPasswordHash = await this._generateHash(
      authUserData.password,
      user.passwordSalt
    );
    if (user.passwordHash !== requestedPasswordHash || !user) {
      return null;
    }
    return userMapper(user);
  }
}
