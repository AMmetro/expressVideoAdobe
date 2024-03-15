
import { OutputPostType } from "./../models/post/output/post.output";
import { PostDB } from "../models/post/db/post-db";
import {
  RequestInputPostType,
} from "../models/post/input/updateposts-input-model";

import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { BlogModel, LikesModel } from "../BD/db";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { OutputBasicSortQueryType } from "../utils/sortQeryUtils";
import { ResultCode } from "../validators/error-validators";
import { likeStatusEnum } from "../models/likes/db/likes-db";

export class PostServices {

  static async create(
    createPostModel: RequestInputPostType
  ): Promise<OutputPostType | null> {
    const { title, shortDescription, content, blogId } = createPostModel;
    const corespondingBlog = await BlogQueryRepository.getById(blogId);
    if (!corespondingBlog) {
      return null;
    }
    const newPostModal: PostDB = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: corespondingBlog.name,
      createdAt: new Date().toISOString(),
    };
    const newPostId = await PostRepository.create(newPostModal);
    if (!newPostId) {
      return null;
    }
    // нужно ли эта проверка ???
    const createdPost = await PostQueryRepository.getById(newPostId);
    if (!createdPost) {
      return null;
    }
    return createdPost;
  }

  static async update(
    updatedPostId: string,
    updatePostModel: RequestInputPostType,
  ): Promise<Boolean | null> {
    const postForUpd = PostQueryRepository.getById(updatedPostId)
    if (!postForUpd) {
      return null;
    }
    const postIsUpdated = PostRepository.update(updatedPostId, updatePostModel)
    return postIsUpdated
  }
  
  static async composePostComments(postId: string, basicSortData: OutputBasicSortQueryType, userId: string|null): Promise<any> {
    const sortData = { id: postId, ...basicSortData };
    const comments = await CommentsQueryRepository.getPostComments(sortData);
    // pagesCount: pagesCount,
    // page: pageNumber,
    // pageSize: pageSize,
    // totalCount: totalCount,
    // items: comments.map(commentMapper),
    if (!comments) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Can not read comments",
      };
    }
   
      const сommentsWithLikes:any = comments.items.map(async (comment) => {
        const likeCounts = await LikesModel.countDocuments({commentId: comment.id})
        const dislikeCounts = await LikesModel.countDocuments({commentId: comment.id})
        let currentLikeStatus = likeStatusEnum.None
        if (userId) {
          const currentLike = await LikesModel.findOne({userId: userId, commentId: comment.id })
          currentLikeStatus = currentLike ? currentLike.myStatus : likeStatusEnum.None
        } 
        return {...comment, likesInfo:{likeCounts, dislikeCounts, myStatus: currentLikeStatus } }
      }) 



   const result = {...comments, items: сommentsWithLikes }
   return {
    status: ResultCode.Success,
    data: result
  };
  }


  static async delete(id: string): Promise<Boolean | null> {
    const isPostdeleted = await PostRepository.delete(id);
    return isPostdeleted;
  }

}
