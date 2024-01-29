import { OutputPostType } from "./../models/post/output/post.output";
import { PostDB } from "../models/post/db/post-db";
import { RequestInputBlogPostType } from "../models/post/input/updateposts-input-model";
import { BlogRepository } from "../repositories/blog-repository";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { InputBlogType, RequestInputBlogType, UpdateBlogType } from "../models/blog/input/updateblog-input-model";
import { blogsCollection } from "../BD/db";
import { BlogDB } from "../models/blog/db/blog-db";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { OutputBlogType } from "../models/blog/output/blog.output";

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
    if (!createdPostId) {
      return null;
    }
    const createdPost = await PostQueryRepository.getById(createdPostId);
    return createdPost;
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
