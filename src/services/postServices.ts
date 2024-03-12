
import { OutputPostType } from "./../models/post/output/post.output";
import { PostDB } from "../models/post/db/post-db";
import {
  RequestInputPostType,
} from "../models/post/input/updateposts-input-model";

import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { BlogModel } from "../BD/db";
import { BlogQueryRepository } from "../repositories/blog.query-repository";

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
  
  static async delete(id: string): Promise<Boolean | null> {
    const isPostdeleted = await PostRepository.delete(id);
    return isPostdeleted;
  }

}
