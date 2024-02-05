import { ObjectId, SortDirection } from 'mongodb';
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
import { RequestInputUserType } from '../models/user/input/updateUser-input-model';
import { OutputUserType } from '../models/user/output/user.output';
import { UserDB } from '../models/user/db/user-db';
import { UserRepository } from '../repositories/user-repository';
import { UserQueryRepository } from '../repositories/user.query-repository';

export class UserServices {

  static async create(
    createUserModel: RequestInputUserType
  ): Promise<OutputUserType | null> {
    const { login, password, email } = createUserModel;
    const newUserModal: UserDB = {
      login: login,
      password: password,
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

  
}
