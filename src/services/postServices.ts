import { ObjectId, SortDirection } from 'mongodb';
import { OutputPostType } from "./../models/post/output/post.output";
import { PostDB } from "../models/post/db/post-db";
import {
  RequestInputPostType,
  postsSortDataType,
} from "../models/post/input/updateposts-input-model";
import { BlogRepository } from "../repositories/blog-repository";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import {
  InputBlogType,
  RequestInputBlogType,
  UpdateBlogType,
} from "../models/blog/input/updateblog-input-model";
import { blogsCollection } from "../BD/db";
import { BlogDB } from "../models/blog/db/blog-db";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { postMapper } from "../models/post/mapper/post-mapper";

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
    id: string,
    updatePostModel: RequestInputPostType,
  ): Promise<Boolean | null> {
    const postForUpd = PostQueryRepository.getById(id)
    if (!postForUpd) {
      return null;
    }
    const updatePostBody = {
      title: updatePostModel.title,
      shortDescription: updatePostModel.shortDescription,
      content: updatePostModel.content,
      blogId: updatePostModel.blogId,
    }
    const postIsUpdated = PostRepository.update(id,updatePostBody)
    return postIsUpdated
  }
  
  static async delete(id: string): Promise<Boolean | null> {
    const isPostdeleted = await PostRepository.delete(id);
    return isPostdeleted;
  }

}
