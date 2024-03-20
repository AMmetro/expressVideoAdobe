import { ResultCode } from "../validators/error-validators";
import { PostLikesModel } from "../BD/db";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { ResultCreatePostLikeType, ResultLikeType } from "../models/likes/output/likes.output";


export type CountType = {
  likesCount: number,
  dislikesCount: number,
  myStatus: string,
}


export class PostLikesServices {

  static async createPostLike(postId: string, userId: string, sendedLikeStatus: string): Promise<ResultCreatePostLikeType> {
    const existingLikeForPost =
      await PostLikesModel.findOne({ postId: postId, userId: userId });
      let newLike = {
        postId: postId,
        userId: userId,
        myStatus: sendedLikeStatus,
        addedAt: new Date(), 
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


  static async countLikes(postId: string, userId: null | string ): Promise<CountType> {

    const likesCount = await PostLikesModel.countDocuments({
      postId: postId,
      myStatus: likeStatusEnum.Like,
    });
    const dislikesCount = await PostLikesModel.countDocuments({
      postId: postId,
      myStatus: likeStatusEnum.Dislike,
    });

    let myStatus = likeStatusEnum.None
    if (userId) {
      const requesterUserLike = await PostLikesModel.findOne({
        postId: postId,
        userId: userId,
      });
      myStatus = requesterUserLike?.myStatus
        ? requesterUserLike.myStatus
        : likeStatusEnum.None;
    }

    const result = {likesCount: likesCount, dislikesCount: dislikesCount, myStatus: myStatus }
  
    return result

  }




}
