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

  static async update(
    updatedCommentId: string,
    updateContent: string 
  ): Promise<Boolean> { 
    try { 
      const commentForUpd = await commentsCollection.updateOne(
        { _id: new ObjectId(updatedCommentId) },
        {
          $set: {
            content: updateContent,
          },
        }
      );
      return !!commentForUpd.matchedCount;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async delete(deleteCommentId: string): Promise<Boolean> {
    const commentForDelete = await commentsCollection.deleteOne({
      _id: new ObjectId(deleteCommentId),
    });

     return !!commentForDelete.deletedCount;
  }
}
