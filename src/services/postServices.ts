import { OutputPostType } from "./../models/post/output/post.output";
import { PostDB } from "../models/post/db/post-db";
import { RequestInputPostType } from "../models/post/input/updateposts-input-model";

import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import {
  BlogModel,
  CommentLikesModel,
  PostLikesModel,
  PostModel,
  UserModel,
} from "../BD/db";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { OutputBasicSortQueryType } from "../utils/sortQeryUtils";
import { ResultCode } from "../validators/error-validators";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { ObjectId } from "mongodb";
import { PostCommentsServices } from "./postCommentServices";
import { ResultCreatePostLikeType } from "../models/likes/output/likes.output";

export class PostServices {
  static async addLikeToComment(
    postId: string,
    sendedLikeStatus: string,
    userId: string
  ): Promise<ResultCreatePostLikeType> {
    const postForLike = await PostModel.findOne({
      _id: new ObjectId(postId),
    });
    if (!postForLike) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Not found post with id " + postId,
      };
    }
    const createdLikeResponse = await PostCommentsServices.createPostLike(
      postId,
      userId,
      sendedLikeStatus
    );

    if (createdLikeResponse.status !== ResultCode.Success) {
      return {
        status: createdLikeResponse.status,
        errorMessage: createdLikeResponse.errorMessage,
      };
    }
    return {
      status: ResultCode.Success,
      data: createdLikeResponse.data,
    };
  }

  static async composePost(
    postId: string,
    userId: null | string
  ): Promise<any | null> {
    const post = await PostQueryRepository.getById(postId);
    if (!post) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Can not read post from database",
      };
    }
    const likesCount = await PostLikesModel.countDocuments({
      postId: postId,
      myStatus: likeStatusEnum.Like,
    });
    const dislikesCount = await PostLikesModel.countDocuments({
      postId: postId,
      myStatus: likeStatusEnum.Dislike,
    });
    let myStatus = likeStatusEnum.None;
    if (userId) {
      const requesterUserLike = await PostLikesModel.findOne({
        postId: postId,
        userId: userId,
      });

      myStatus = requesterUserLike?.myStatus
        ? requesterUserLike.myStatus
        : likeStatusEnum.None;
    }

    const newestLikes = await PostLikesModel.find({
      postId: postId,
      myStatus: likeStatusEnum.Like,
    })
      // 1 asc старая запись в начале
      // -1 descend новая в начале
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();

    const newestLikesUpd = await Promise.all(
      newestLikes.map(async (like) => {
        const user = await UserModel.findOne({ _id: like.userId });
        if (user && user.login) {
          return {
            userId: like.userId,
            addedAt: like.addedAt,
            login: user.login,
          };
        } else {
          return null;
        }
      })
    );

    const composedPost = {
      ...post,
      extendedLikesInfo: {
        newestLikes: newestLikesUpd,
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
      },
    };
    return composedPost;
  }

  static async composeAllPosts(
    postsRequestsSortData: OutputBasicSortQueryType, userId: null | string
  ): Promise<any | null> {
    const allPostsObject = await PostQueryRepository.getAll(
      postsRequestsSortData
    );
    if (!allPostsObject) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Can not read posts from database",
      };
    }

    const postsWithLikes = await Promise.all(
      allPostsObject.items.map(async (post) => {
        const likesCount = await PostLikesModel.countDocuments({
          postId: post.id,
          myStatus: likeStatusEnum.Like,
        });
        const dislikesCount = await PostLikesModel.countDocuments({
          postId: post.id,
          myStatus: likeStatusEnum.Dislike,
        });
        let myStatus = likeStatusEnum.None

        if (userId) {
          const requesterUserLike = await PostLikesModel.findOne({
            postId: post.id,
            userId: userId,
          });
          myStatus = requesterUserLike?.myStatus
            ? requesterUserLike.myStatus
            : likeStatusEnum.None;
        }

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const newestLikes = await PostLikesModel.find({
          postId: post.id,
          myStatus: likeStatusEnum.Like,
        })
          // 1 asc старая запись в начале
          // -1 descend новая в начале
          .sort({ addedAt: -1 })
          .limit(3)
          .lean();

        const newestLikesUpd = await Promise.all(
          newestLikes.map(async (like) => {
            const user = await UserModel.findOne({ _id: like.userId });
            if (user && user.login) {
              return {
                userId: like.userId,
                addedAt: like.addedAt,
                login: user.login,
              };
            } else {
              return null;
            }
          })
        );

        const extendedLikesInfo = {
          newestLikes: newestLikesUpd,
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: myStatus,
        };
        return { ...post, extendedLikesInfo };
      })
    );

    return {
      status: ResultCode.Success,
      data: { ...allPostsObject, items: postsWithLikes },
    };
  }

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
    const createdPost = await PostQueryRepository.getById(newPostId);
    if (!createdPost) {
      return null;
    }

    const extendedLikesInfo = {
      newestLikes: [],
      likesCount: 0,
      dislikesCount: 0,
      myStatus: likeStatusEnum.None,
    };
    return { ...createdPost, extendedLikesInfo: extendedLikesInfo };
  }

  static async update(
    updatedPostId: string,
    updatePostModel: RequestInputPostType
  ): Promise<Boolean | null> {
    const postForUpd = PostQueryRepository.getById(updatedPostId);
    if (!postForUpd) {
      return null;
    }
    const postIsUpdated = PostRepository.update(updatedPostId, updatePostModel);
    return postIsUpdated;
  }

  static async composePostComments(
    postId: string,
    basicSortData: OutputBasicSortQueryType,
    userId: string | null
  ): Promise<any> {
    const sortData = { id: postId, ...basicSortData };
    const comments = await CommentsQueryRepository.getPostComments(sortData);
    if (!comments) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Can not read comments",
      };
    }
    const сommentsWithLikes: any = await Promise.all(
      comments.items.map(async (comment) => {
        const likesCount = await CommentLikesModel.countDocuments({
          commentId: comment.id,
          myStatus: likeStatusEnum.Like,
        });
        const dislikesCount = await CommentLikesModel.countDocuments({
          commentId: comment.id,
          myStatus: likeStatusEnum.Dislike,
        });

        // const [  likeCounts, dislikeCounts] =  await Promise.all (
        //   [
        //     LikesModel.countDocuments({commentId: comment.id, myStatus: likeStatusEnum.Like }),
        //     LikesModel.countDocuments({commentId: comment.id,  myStatus: likeStatusEnum.Dislike})
        //   ]
        // )

        let currentLikeStatus = likeStatusEnum.None;
        if (userId) {
          const currentLike = await CommentLikesModel.findOne({
            userId: userId,
            commentId: comment.id,
          });
          currentLikeStatus = currentLike
            ? currentLike.myStatus
            : likeStatusEnum.None;
        }
        return {
          ...comment,
          likesInfo: { likesCount, dislikesCount, myStatus: currentLikeStatus },
        };
      })
    );
    const result = { ...comments, items: сommentsWithLikes };

    return {
      status: ResultCode.Success,
      data: result,
    };
  }

  static async delete(id: string): Promise<Boolean | null> {
    const isPostdeleted = await PostRepository.delete(id);
    return isPostdeleted;
  }
}
