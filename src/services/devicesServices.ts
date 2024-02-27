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
import { DevicesQueryRepository } from '../repositories/devices.query-repository';
import { OutputDevicesType } from '../models/devices/output/devices.output';
import { Result, ResultCode } from '../validators/error-validators';
import { ResultType } from '../models/user/output/user.output';

export class DevicesServices {

  static async getUsersDevices(userId: string): Promise<Result<OutputDevicesType[]> | null> {

    const userDevices = await DevicesQueryRepository.getByUserId(userId);   
    if (!userDevices) {
      return {
        status: ResultCode.NotFound,
          errorMessage: "Not found devices for user with id: userId" ,
          }
    }
    return {
      status: ResultCode.Success,
      data: userDevices,
    };
    // const newPostModal: PostDB = {
    //   title: title,
    //   shortDescription: shortDescription,
    //   content: content,
    //   blogId: blogId,
    //   blogName: corespondingBlog.name,
    //   createdAt: new Date().toISOString(),
    // };
    // const newPostId = await PostRepository.create(newPostModal);
    // if (!newPostId) {
    //   return null;
    // }
    // // нужно ли эта проверка ???
    // const createdPost = await PostQueryRepository.getById(newPostId);
    // if (!createdPost) {
    //   return null;
    // }
    // return createdPost;
  }

 
  
  static async delete(id: string): Promise<Boolean | null> {
    const isPostdeleted = await PostRepository.delete(id);
    return isPostdeleted;
  }

}
