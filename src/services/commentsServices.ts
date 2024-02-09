import {WithId} from 'mongodb'
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
import { UserDB } from "../models/user/db/user-db";
import { UserRepository } from "../repositories/user-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import {
  AuthUserFindModel,
  AuthUserInputModel,
} from "../models/user/input/authUser-input-model";
import bcrypt from "bcrypt";
import { userMapper } from "../models/user/mapper/user-mapper";
import { CommentDB } from '../models/comments/db/comment-db';

export class CommentsServices {

  static async create(
    newCommentModal: CommentDB
  ): Promise<OutputUserType | null> {
    // const { content, userId, userLogin } = newCommentModal;

    const newComment: CommentDB = {
      content: newCommentModal.content,
      commentatorInfo: {
        userId: newCommentModal.content.userId,
        userLogin: newCommentModal.content.userLogin,
      },
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

  // static async delete(id: string): Promise<Boolean | null> {
  //   const isUserDeleted = await UserRepository.delete(id);
  //   return isUserDeleted;
  // }

  // static async checkCredentials(authUserData: AuthUserFindModel): Promise<OutputUserType | null> {
  //   const user: WithId<UserDB> | null = await UserQueryRepository.getOneForAuth(authUserData);
  //   if (!user){
  //     return null
  //   }
  //   const requestedPasswordHash = await this._generateHash(authUserData.password, user.passwordSalt )
  //   if ((user.passwordHash !== requestedPasswordHash) || !user){
  //     return null
  //   }
  //   return userMapper(user);
  // }
}
