import { ObjectId } from "mongodb";
import { postsCollection } from "../BD/db";
import { RequestInputPostType, UpdateInputPostType } from "../models/post/input/updateposts-input-model";
export class PostRepository {

  static async create(newPostData: UpdateInputPostType) {
        const newPostId = await postsCollection.insertOne(newPostData);
       return newPostId.insertedId.toString()
  }

  static async update(
    updatedPostId: string,
    updatedPostData: RequestInputPostType
  ): Promise<Boolean> {

    const postForUpd = await postsCollection.updateOne(
      { _id: new ObjectId(updatedPostId) },
      {$set: {...updatedPostData}}
    );
    return !!postForUpd.modifiedCount;
  }

  static async delete(deletePostId: string): Promise<Boolean> {
    const deletePost = await postsCollection.deleteOne({
      _id: new ObjectId(deletePostId),
    });
    return !!deletePost.deletedCount;
  }
}
