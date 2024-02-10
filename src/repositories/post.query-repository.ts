import { WithId, ObjectId } from "mongodb";
import { blogsCollection, postsCollection } from "../BD/db";
import { postMapper } from "../models/post/mapper/post-mapper";
import { OutputPostType } from "../models/post/output/post.output";
import { RequestInputPostType, UpdateInputPostType, postsSortDataType } from "../models/post/input/updateposts-input-model";
import { PostDB } from "../models/post/db/post-db";
import { PaginationType } from "../models/common";

export class PostQueryRepository {

  static async getAll(postsSortData: postsSortDataType, blogId?:string):Promise<PaginationType<OutputPostType> | null> {
  const { sortBy, sortDirection, pageNumber, pageSize } = postsSortData
   let filter = {}
   if (blogId){filter = {blogId: blogId} }
   try {
    const posts: WithId<PostDB>[] = await postsCollection
    .find(filter)
    .sort(sortBy, sortDirection)
    .skip((pageNumber-1) * pageSize)
    .limit(pageSize)
    .toArray();
    const totalCount = await postsCollection.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts.map(postMapper),
    } 
   } catch (error) {console.log(error); return null;} 
  }
  
  static async getById(id: string): Promise<OutputPostType | null> {
    const post = await postsCollection.findOne({
       _id: new ObjectId(id) 
    });
    if (!post) {
      return null;
    }
    return postMapper(post);
  }
 
}
