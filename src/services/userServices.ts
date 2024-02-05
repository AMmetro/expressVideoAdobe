import { ObjectId, SortDirection } from "mongodb";
import { OutputPostType } from "./../models/post/output/post.output";
import { PostDB } from "../models/post/db/post-db";
import {
  RequestInputPostType,
  postsSortDataType,
} from "../models/post/input/updateposts-input-model";
import { BlogRepository } from "../repositories/blog-repository";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import {
  InputBlogType,
  RequestInputBlogType,
  UpdateBlogType,
} from "../models/blog/input/updateblog-input-model";
import { blogsCollection } from "../BD/db";
import { BlogDB } from "../models/blog/db/blog-db";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { postMapper } from "../models/post/mapper/post-mapper";
import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { OutputUserType } from "../models/user/output/user.output";
import { UserDB, UserModel } from "../models/user/db/user-db";
import { UserRepository } from "../repositories/user-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import {
  AuthUserFindModel,
  AuthUserInputModel,
} from "../models/user/input/authUser-input-model";
import bcrypt from "bcrypt";

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

  static async auth(authUserData: AuthUserFindModel): Promise<any | null> {
    // console.log("-------------------authUserData------------------")
    // console.log(authUserData)
    const user = await UserQueryRepository.getOneForAuth(authUserData);
    if (!user){
      return null
    }
    // const requestedPassword = authUserData.password
    const requestedPasswordHash = await this._generateHash(authUserData.password, user.passwordSalt )
    if ((user.passwordHash !== requestedPasswordHash) || !user){
      return null
    }
    return user;
  }
}
