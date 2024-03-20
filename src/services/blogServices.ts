import { OutputPostType, OutputPostTypeMapper } from "./../models/post/output/post.output";
import { PostDB } from "../models/post/db/post-db";
import { RequestInputBlogPostType } from "../models/post/input/updateposts-input-model";
import { BlogRepository } from "../repositories/blog-repository";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { RequestInputBlogType, UpdateBlogType } from "../models/blog/input/updateblog-input-model";
import { BlogDB } from "../models/blog/db/blog-db";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { OutputBasicSortQueryType } from "../utils/sortQeryUtils";
import { ResultCode } from "../validators/error-validators";
import { PostLikesModel } from "../BD/db";
import { newestLikesServices } from "./newestLikesServices";
import { PostLikesServices } from "./postLikesServices";

export class BlogServices {

  static async createBlog(
    createBlogModel: RequestInputBlogType
  ): Promise<OutputBlogType | null> {
    const { name, description, websiteUrl } = createBlogModel;
    const newBlog: BlogDB = {
      name: name, 
      description: description, 
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const createdBlogId = await BlogRepository.create(newBlog);
    if (!createdBlogId) {
      return null;
    }
    const createdBlog = await BlogQueryRepository.getById(createdBlogId);
    return createdBlog
    }

  static async createPostToBlog(
    blogId: string,
    createPostModel: RequestInputBlogPostType
  ): Promise<OutputPostType | null> {
    const { title, shortDescription, content } = createPostModel;
    const currentBlog = await BlogRepository.getById(blogId);
    if (!currentBlog) {
      return null;
    }
    const newPost: PostDB = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogName: currentBlog.name,
      blogId: currentBlog.id,
      createdAt: new Date().toISOString(),
    };
    const createdPostId = await PostRepository.create(newPost);
    const createdPost = await PostQueryRepository.getById(createdPostId);
    if (!createdPost) {
      return null;
    }
    const extendedLikesInfo = {
      dislikesCount: 0,
      likesCount: 0,
      myStatus: likeStatusEnum.None,
      newestLikes: [],
       }
    return {...createdPost, extendedLikesInfo: extendedLikesInfo};
  }

  static async composeBlogPosts(
    blogId: string,
    basicSortData: OutputBasicSortQueryType,
    userId: string | null
  ): Promise<any> {
    const allBlogPostsObj = await PostQueryRepository.getAll(basicSortData, blogId );
    if (!allBlogPostsObj?.items) {
      return {
        status: ResultCode.NotFound,
        errorMessage: "Can not read posts in DB by ID",
      };
    }

   const postsWithLikes = await Promise.all(
    
      allBlogPostsObj.items.map(async (post) => {

        const newestLikes = await PostLikesModel.find({
          postId: post.id,
          myStatus: likeStatusEnum.Like,
        })
          // 1 asc старая запись в начале
          // -1 descend новая в начале
          .sort({ addedAt: -1 })
          .limit(3)
          .lean();

          console.log("newestLikes")
          console.log(newestLikes)

          const newestLikesWithUser = await newestLikesServices.addUserDataToLike(newestLikes)

         const countLikes = await PostLikesServices.countLikes(post.id, userId)

          console.log("newestLikesWithUser")
          console.log(newestLikesWithUser)

          const extendedLikesInfo = {
            likesCount: countLikes.likesCount,
            dislikesCount: countLikes.dislikesCount,
            myStatus: countLikes.myStatus,
            newestLikes: newestLikesWithUser
          }

        return {...post, extendedLikesInfo: extendedLikesInfo };
      })
    );

    const allBlogPostsObjFull = { ...allBlogPostsObj, items: postsWithLikes };

    return {
      status: ResultCode.Success,
      data: allBlogPostsObjFull,
    };

  }













  static async updateBlog(
    updatedBlogId: string,
    updatedBlogModel: UpdateBlogType
  ): Promise<Boolean> {
    const updatedBlog = await BlogRepository.update(
      updatedBlogId,
      updatedBlogModel
    );
    return updatedBlog;
  }

  static async deleteBlog(
    deletedBlogId: string,
  ): Promise<Boolean> {
    const isuBlogDelete = await BlogRepository.delete(deletedBlogId);
    return isuBlogDelete;
  }
}
