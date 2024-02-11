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
import { CommentRepository } from '../repositories/comment-repository';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { OutputCommentType, ResultCommentType } from '../models/comments/output/comment.output';
import { ResultCode } from '../validators/error-validators';
import { commentMapper } from '../models/comments/mapper/comment-mapper';

export class CommentsServices {

  static async create(
    commentedPostId:string, userCommentatorId:string, content:string
    // newCommentModal: CommentDB
  ): Promise<ResultCommentType> {
    const commentedPost = await PostQueryRepository.getById(commentedPostId);
    if (commentedPost === null) {
     return {
      status: ResultCode.NotFound,
        errorMessage: "Not found post with id " + commentedPostId,
        }
    }
    const commentatorInfo = await UserQueryRepository.getById(userCommentatorId);
    if (commentatorInfo === null) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found user with id " + userCommentatorId,
        }
    }
    const newCommentModal = {
      content: content,
      postId: commentedPostId,
      commentatorInfo: {
        userId: commentatorInfo.id,
        userLogin: commentatorInfo.login,
      },
      createdAt: new Date().toISOString(),
    };
    const createdCommentId = await CommentRepository.create(newCommentModal);
      if (!createdCommentId) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Creating comment error"
        }
    }
    const createdComment = await CommentsQueryRepository.getById(createdCommentId);
    if (!createdComment) {
      return {
        status: ResultCode.ServerError,
        errorMessage: "Service temporarily unavailable"
        }
    }

    // const mappedCreatedComment = commentMapper(createdComment)

    return {
      status: ResultCode.Success,
      data: createdComment
    }
  }

  static async update(updateCommentId:string, updateContent:string, updaterUserId:string): Promise<ResultCommentType> {
    const commentForUpdate = await CommentsQueryRepository.getById(updateCommentId);
    if (commentForUpdate === null) {
     return {
      status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + updateCommentId,
        }
    }
    if (commentForUpdate.commentatorInfo.userId !== updaterUserId){
      return {
        status: ResultCode.Forbidden,
        errorMessage: "You try update the comment that is not your own",
        }
      }
    const commentIsUpdate = await CommentRepository.update(updateCommentId, updateContent );
    if (!commentIsUpdate){
      return {
        status: ResultCode.ServerError,
        errorMessage: "Service temporarily unavailable"
        }
    }
    return {
      status: ResultCode.Success,
      data: commentIsUpdate
    }
  }

  static async delete(deleteCommentId:string, removerId:string): Promise<ResultCommentType> {
    const commentForDelete = await CommentsQueryRepository.getById(deleteCommentId);
    if (commentForDelete === null) {
     return {
      status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + deleteCommentId,
        }
    }
    if (commentForDelete.commentatorInfo.userId !== removerId){
      return {
        status: ResultCode.Unauthorised,
        errorMessage: "You try delete the comment that is not your own",
        }
      }
    const commentIsDelete = await CommentRepository.delete(deleteCommentId);
    if (!commentIsDelete){
      return {
        status: ResultCode.ServerError,
        errorMessage: "Service temporarily unavailable"
        }
    }
    return {
      status: ResultCode.Success,
      data: commentIsDelete
    }
  }




}
