import { ObjectId } from "mongodb";
import { CommentModel } from "../BD/db";
import { CommentDB } from "../models/comments/db/comment-db";

export class CommentRepository {
  
  static async create(newCommentModal: CommentDB): Promise<string | null> {
      try{
    const commentId = await CommentModel.create(newCommentModal); 
    return commentId._id.toString();
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
      const commentForUpd = await CommentModel.updateOne(
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
    const commentForDelete = await CommentModel.deleteOne({
      _id: new ObjectId(deleteCommentId),
    });

     return !!commentForDelete.deletedCount;
  }
}
