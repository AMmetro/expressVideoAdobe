import { WithId, ObjectId } from "mongodb";
import { blogsCollection, commentsCollection, db } from "../BD/db";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { BlogDB } from "../models/blog/db/blog-db";
import { blogMapper } from "../models/blog/mapper/blog-mapper";
import { InputBlogType, UpdateBlogType } from "../models/blog/input/updateblog-input-model";
import { CommentDB } from "../models/comments/db/comment-db";

export class CommentRepository {
  
  static async create(newCommentModal: CommentDB): Promise<string | null> {
      try{
    const commentId = await commentsCollection.insertOne(newCommentModal); 
    return commentId.insertedId.toString();
    } catch(e){
      console.log(e) 
      return null
    } 
  }

  // static async getById(id: string): Promise<OutputBlogType | null> {
  //   const blog = await blogsCollection.findOne({ _id: new ObjectId(id)});
  //   if (!blog) {
  //     return null;
  //   }
  //   return blogMapper(blog);
  // }

  // static async update(
  //   updatedBlogId: string,
  //   updatedBlogData: UpdateBlogType 
  // ): Promise<Boolean> { 
  //   try { 
  //     const blogForUpd = await blogsCollection.updateOne(
  //       { _id: new ObjectId(updatedBlogId) },
  //       {
  //         $set: {
  //           name: updatedBlogData.name,
  //           description: updatedBlogData.description,
  //           websiteUrl: updatedBlogData.websiteUrl,
  //         },
  //       }
  //     );
  //     return !!blogForUpd.matchedCount;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  // }

  static async delete(deleteCommentId: string): Promise<Boolean> {
    const commentForDelete = await commentsCollection.deleteOne({
      _id: new ObjectId(deleteCommentId),
    });

     return !!commentForDelete.deletedCount;
  }
}
