import { ResultCode } from "../validators/error-validators";
import { LikesQueryRepository } from "../repositories/likes.query-repository";
import { CommentModel, CommentLikesModel, PostLikesModel } from "../BD/db";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { OutputLikesType, ResultCreateLikeType, ResultCreatePostLikeType, ResultLikeType } from "../models/likes/output/likes.output";

export class PostCommentsServices {

  // static async composeCommentLikes(commentId: string, userId: null | string): Promise<ResultLikeType> {
  //   const commentLikes = await LikesQueryRepository.getById(commentId);
  //   if (!commentLikes) {
  //     return {
  //       status: ResultCode.NotFound,
  //       errorMessage: "Cant read database with likes",
  //     };
  //   }
  //   let likesInfo = {
  //     likesCount: 0,
  //     dislikesCount: 0,
  //     myStatus: likeStatusEnum.None,
  //   }
  //   commentLikes.forEach((like) => {
  //     if (like.myStatus === likeStatusEnum.Like) {
  //       likesInfo.likesCount +=1;
  //     }
  //     if (like.myStatus === likeStatusEnum.Dislike) {
  //       likesInfo.dislikesCount +=1;
  //     }
  //     if (like.userId === userId) {
  //       likesInfo.myStatus = like.myStatus;
  //     }
  //   });
  //   return {
  //     status: ResultCode.Success,
  //     data: likesInfo,
  //   };
  // }


  static async createPostLike(postId: string, userId: string, sendedLikeStatus: string): Promise<ResultCreatePostLikeType> {
    const existingLikeForPost =
      await PostLikesModel.findOne({ postId: postId, userId: userId });
      let newLike = {
        postId: postId,
        userId: userId,
        myStatus: sendedLikeStatus,
        addetAt: new Date(),
      };
    if (!existingLikeForPost) {
       let LikeInstance = new PostLikesModel(newLike);
       LikeInstance.save();
      return {
        status: ResultCode.Success,
        data: newLike,
      };
    }

    if (existingLikeForPost.myStatus === sendedLikeStatus) {
      return {
        status: ResultCode.Success,
        data: newLike,
      };
    }
    existingLikeForPost.myStatus = sendedLikeStatus
    existingLikeForPost.save()
    newLike.myStatus = sendedLikeStatus
    return {
      status: ResultCode.Success,
      data: newLike,
    };
  }




}
