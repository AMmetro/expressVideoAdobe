import { PostQueryRepository } from "../repositories/post.query-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { ResultCommentType } from "../models/comments/output/comment.output";
import { Result, ResultCode } from "../validators/error-validators";
import { LikesQueryRepository } from "../repositories/likes.query-repository";
import { CommentModel, LikesModel } from "../BD/db";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { OutputLikesType, ResultCreateLikeType, ResultLikeType } from "../models/likes/output/likes.output";
import { ObjectId, WithId } from "mongodb";
import { LikesDB } from "../models/likes/db/likes-db";

export class LikeCommentsServices {

  static async composeCommentLikes(commentId: string, userId: null | string): Promise<ResultLikeType> {
    const commentLikes = await LikesQueryRepository.getById(commentId);
    if (!commentLikes) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Cant read database with likes",
      };
    }
    let likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: likeStatusEnum.None,
    }
    commentLikes.forEach((like) => {
      if (like.myStatus === likeStatusEnum.Like) {
        likesInfo.likesCount +=1;
      }
      if (like.myStatus === likeStatusEnum.Dislike) {
        likesInfo.dislikesCount +=1;
      }
      if (like.userId === userId) {
        likesInfo.myStatus = like.myStatus;
      }
    });
    return {
      status: ResultCode.Success,
      data: likesInfo,
    };
  }


  static async createCommentLike(commentId: string, userId: string, sendedLikeStatus: string): Promise<ResultCreateLikeType> {
    const existingLikeForComment =
      await LikesModel.findOne({ commentId: commentId, userId: userId });
      let newLike = {
        commentId: commentId,
        userId: userId,
        myStatus: sendedLikeStatus,
      };
    if (!existingLikeForComment) {
       let LikeInstance = new LikesModel(newLike);
       LikeInstance.save();
      return {
        status: ResultCode.Success,
        data: newLike,
      };
    }
    if (existingLikeForComment.myStatus === sendedLikeStatus) {
      return {
        status: ResultCode.Success,
        data: newLike,
      };
    }
    existingLikeForComment.myStatus = sendedLikeStatus
    existingLikeForComment.save()
    newLike.myStatus = sendedLikeStatus
    return {
      status: ResultCode.Success,
      data: newLike,
    };
  }




}
