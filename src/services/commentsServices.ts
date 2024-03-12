
import { PostQueryRepository } from "../repositories/post.query-repository";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { CommentRepository } from '../repositories/comment-repository';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { ResultCommentType } from '../models/comments/output/comment.output';
import { ResultCode } from '../validators/error-validators';
import { LikesQueryRepository } from "../repositories/likes.query-repository";
import { CommentModel, LikesModel } from "../BD/db";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { ResultLikeType } from "../models/likes/output/likes.output";
import { ObjectId } from "mongodb";


export class CommentsServices {

  static async create(
    commentedPostId:string, userCommentatorId:string, content:string
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
        myStatus: "None"
      },
      createdAt: new Date().toISOString(),
    };
    const createdCommentId = await CommentRepository.create(newCommentModel);
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
        status: ResultCode.Forbidden,
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


  static async composeComment(commentId:string): Promise<ResultCommentType> {
    // const comment = await CommentsQueryRepository.getById(commentId);
    // if (!comment){
    //   return {
    //     status: ResultCode.NotFound,
    //     errorMessage: "Not found comment with id " + commentId,
    //     }
    // }
    const commentsLikes = await LikesQueryRepository.getById(commentId);
    if (!commentsLikes){
      return {
        status: ResultCode.NotFound,
        errorMessage: "Cant read database with likes ",
        }
    }


//     --------commentsLikes--------
// [ { id: '65f0798f29143caaadc8d69b', commentId: '555' } ]
    console.log("--------commentsLikes--------")
    console.log(commentsLikes)

    let likesCount = 0;
    let dislikesCount = 0;
    commentsLikes.forEach(like=>{ 
      if (like.commentId !== commentId) {
        likesCount  += 1
      }
      if (like.commentId !== commentId) {
        dislikesCount  += 1
      }
    })

    
    const result = {
    id: "string",
    content: "string",
    commentatorInfo: {
      userId: "string",
      userLogin: "string",
    },
    likesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      },
    createdAt: "string",
    }


    return {
      status: ResultCode.Success,
      data: result
    }
  }


  static async addLike(commentId:string, likeStatus: typeof likeStatusEnum, userId:string): Promise<ResultLikeType> {
    
    const commentForValidation = await CommentModel.findOne({ _id: new ObjectId(commentId) });
                                                    console.log("commentForValidation")
                                                    console.log(commentForValidation)
        if (!commentForValidation){
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found comment with id " + commentId,
        }
    }

    const newLike = {
    userId: userId,
    commentId: commentId,
    myStatus:  likeStatus,
    }

     const LikeInstance = new LikesModel(newLike)
     await LikeInstance.save()

    // if (!comment){
    //   return {
    //     status: ResultCode.NotFound,
    //     errorMessage: "Not found comment with id " + commentId,
    //     }
    // }

    return {
      status: ResultCode.Success,
      data: true
    }
  }




}
