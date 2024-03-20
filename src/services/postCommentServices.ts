import { ResultCode } from "../validators/error-validators";
import { LikesQueryRepository } from "../repositories/likes.query-repository";
import { CommentModel, CommentLikesModel, PostLikesModel } from "../BD/db";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { OutputLikesType, ResultCreateLikeType, ResultCreatePostLikeType, ResultLikeType } from "../models/likes/output/likes.output";

export class PostCommentsServices {

  static async createPostLike(postId: string, userId: string, sendedLikeStatus: string): Promise<ResultCreatePostLikeType> {
    const existingLikeForPost =
      await PostLikesModel.findOne({ postId: postId, userId: userId });
      let newLike = {
        postId: postId,
        userId: userId,
        myStatus: sendedLikeStatus,
        addedAt: new Date(), 
      };

      // const resultLike = {...newLike, addetAt: newLike.addetAt.toISOString() }

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
