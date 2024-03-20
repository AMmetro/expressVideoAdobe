import { PostQueryRepository } from "../repositories/post.query-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { OutputCommentType, ResultCommentType } from "../models/comments/output/comment.output";
import { Result, ResultCode } from "../validators/error-validators";
import { CommentModel, CommentLikesModel } from "../BD/db";
import { ResultCreateLikeType, ResultLikeType } from "../models/likes/output/likes.output";
import { ObjectId, WithId } from "mongodb";
import { LikeCommentsServices } from "./commentLikesServices";


export class CommentsServices {

  static async create(
    commentedPostId: string,
    userCommentatorId: string,
    content: string
  ): Promise<ResultCommentType> {
    const commentedPost = await PostQueryRepository.getById(commentedPostId);
    if (commentedPost === null) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found post with id " + commentedPostId,
      };
    }
    const commentatorInfo = await UserQueryRepository.getById(
      userCommentatorId
    );
    if (commentatorInfo === null) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found user with id " + userCommentatorId,
      };
    }
    const newCommentModel = {
      content: content,
      postId: commentedPostId,
      commentatorInfo: {
        userId: commentatorInfo.id,
        userLogin: commentatorInfo.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
      createdAt: new Date().toISOString(),
    };
    const createdCommentId = await CommentRepository.create(newCommentModel);
    if (!createdCommentId) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Creating comment error",
      };
    }
    const createdComment = await CommentsQueryRepository.getById(
      createdCommentId
    );
    if (!createdComment) {
      return {
        status: ResultCode.ServerError,
        errorMessage: "Service temporarily unavailable",
      };
    }
    return {
      status: ResultCode.Success,
      data: {
        ...createdComment,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
        },
      },
    };
  }

  static async update(
    updateCommentId: string,
    updateContent: string,
    updaterUserId: string
  ): Promise<ResultCommentType> {
    const commentForUpdate = await CommentsQueryRepository.getById(
      updateCommentId
    );
    if (commentForUpdate === null) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + updateCommentId,
      };
    }
    if (commentForUpdate.commentatorInfo.userId !== updaterUserId) {
      return {
        status: ResultCode.Forbidden,
        errorMessage: "You try update the comment that is not your own",
      };
    }
    const commentIsUpdate = await CommentRepository.update(
      updateCommentId,
      updateContent
    );
    if (!commentIsUpdate) {
      return {
        status: ResultCode.ServerError,
        errorMessage: "Service temporarily unavailable",
      };
    }
    return {
      status: ResultCode.Success,
      data: {} as OutputCommentType ,
    };
  }

  static async delete(
    deleteCommentId: string,
    removerId: string
  ): Promise<ResultCommentType> {
    const commentForDelete = await CommentsQueryRepository.getById(
      deleteCommentId
    );
    if (commentForDelete === null) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + deleteCommentId,
      };
    }
    if (commentForDelete.commentatorInfo.userId !== removerId) {
      return {
        status: ResultCode.Forbidden,
        errorMessage: "You try delete the comment that is not your own",
      };
    }
    const commentIsDelete = await CommentRepository.delete(deleteCommentId);
    if (!commentIsDelete) {
      return {
        status: ResultCode.ServerError,
        errorMessage: "Service temporarily unavailable",
      };
    }
    return {
      status: ResultCode.Success,
      data: {} as OutputCommentType,
    };
  }


  static async composeComment(commentId: string, userId: null | string): Promise<ResultCommentType> {
    const comment = await CommentsQueryRepository.getById(commentId);
    if (!comment) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + commentId,
      };
    }
    const composedCommentLikes = await LikeCommentsServices.composeCommentLikes(commentId, userId)
    if (composedCommentLikes.status !== ResultCode.Success || !composedCommentLikes.data ) {
      return {
          status: composedCommentLikes.status,
          errorMessage: composedCommentLikes.errorMessage,
      }
    }
    const resultComment = {
      id: commentId,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: composedCommentLikes.data,
      createdAt: comment.createdAt,
    };
    return {
      status: ResultCode.Success,
      data: resultComment,
    };
  }


  static async addLikeToComment(
    commentId: string,
    sendedLikeStatus: string,
    userId: string
  ): Promise<ResultCreateLikeType> {
    const commentForLike = await CommentModel.findOne({
      _id: new ObjectId(commentId),
    });
    if (!commentForLike) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + commentId,
      };
    }
    const createdLikeResponse = await LikeCommentsServices.createCommentLike(commentId, userId, sendedLikeStatus )
    return createdLikeResponse
  }
}
