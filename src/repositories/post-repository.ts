import { ObjectId } from "mongodb";
import { PostModel } from "../BD/db";
import { RequestInputPostType, UpdateInputPostType } from "../models/post/input/updateposts-input-model";
export class PostRepository {

  static async create(newPostData: UpdateInputPostType) {
        const newPostId = await PostModel.create(newPostData);
       return newPostId._id.toString()
  }

  static async update(
    updatedPostId: string,
    updatedPostData: RequestInputPostType
  ): Promise<Boolean> {

    const postForUpd = await PostModel.updateOne(
      { _id: new ObjectId(updatedPostId) },
      {$set: {...updatedPostData}}
    );
    return !!postForUpd.modifiedCount;
  }

  static async delete(deletePostId: string): Promise<Boolean> {
    const deletePost = await PostModel.deleteOne({
      _id: new ObjectId(deletePostId),
    });
    return !!deletePost.deletedCount;
  }
}
