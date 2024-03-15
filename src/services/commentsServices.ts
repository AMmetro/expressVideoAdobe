import { PostQueryRepository } from "../repositories/post.query-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { ResultCommentType } from "../models/comments/output/comment.output";
import { Result, ResultCode } from "../validators/error-validators";
import { LikesQueryRepository } from "../repositories/likes.query-repository";
import { CommentModel, LikesModel } from "../BD/db";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { ResultLikeType } from "../models/likes/output/likes.output";
import { ObjectId, WithId } from "mongodb";
import { LikesDB } from "../models/likes/db/likes-db";

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
      data: commentIsUpdate,
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
      data: commentIsDelete,
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
    const commentLikes = await LikesQueryRepository.getById(commentId);
    if (!commentLikes) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Cant read database with likes",
      };
    }

    let likesCount = 0;
    let dislikesCount = 0;
    let myStatus = likeStatusEnum.None;

    commentLikes.forEach((like) => {
      if (like.myStatus === likeStatusEnum.Like) {
        likesCount += 1;
      }
      if (like.myStatus === likeStatusEnum.Dislike) {
        dislikesCount += 1;
      }
      if (like.userId === userId) {
        myStatus = like.myStatus;
      } else { myStatus = likeStatusEnum.None}
    });

    const resultComment = {
      id: commentId,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
      },
      createdAt: comment.createdAt,
    };

    return {
      status: ResultCode.Success,
      data: resultComment,
    };
  }



  static async addLike(
    commentId: string,
    sendedLikeStatus: string,
    userId: string
  ): Promise<ResultLikeType> {
    const commentForLike = await CommentModel.findOne({
      _id: new ObjectId(commentId),
    });
    if (!commentForLike) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + commentId,
      };
    }

    const existingLikeForComment =
      await LikesModel.findOne({ commentId: commentId, userId: userId });

    if (!existingLikeForComment) {
      const newLike = {
        commentId: commentId,
        userId: userId,
        myStatus: sendedLikeStatus,
      };
       let LikeInstance = new LikesModel(newLike);
       LikeInstance.save();
      return {
        status: ResultCode.Success,
        data: true,
      };
    }

    if (existingLikeForComment.myStatus === sendedLikeStatus) {
      return {
        status: ResultCode.Success,
        data: true,
      };
    }

    existingLikeForComment.myStatus = sendedLikeStatus
    existingLikeForComment.save()
    return {
      status: ResultCode.Success,
      data: true,
    };

    // if (sendedLikeStatus === likeStatusEnum.Like) {
    //   existingLikeForComment.myStatus = sendedLikeStatus
    //   existingLikeForComment.save()
    //   return {
    //     status: ResultCode.Success,
    //     data: true,
    //   };
    // }
    // if (sendedLikeStatus === likeStatusEnum.Dislike) {
    //   existingLikeForComment.myStatus = sendedLikeStatus
    //   existingLikeForComment.save()
    //   return {
    //     status: ResultCode.Success,
    //     data: true,
    //   };
    // }
    // return {
    //   status: ResultCode.Success,
    //   data: true,
    // };
  }
}
