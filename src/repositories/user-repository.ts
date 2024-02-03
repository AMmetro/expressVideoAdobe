import { WithId, ObjectId } from "mongodb";
import { blogsCollection, postsCollection, usersCollection } from "../BD/db";
import { postMapper } from "../models/post/mapper/post-mapper";
import { OutputPostType } from "../models/post/output/post.output";
import { RequestInputPostType, UpdateInputPostType } from "../models/post/input/updateposts-input-model";
import { PostDB } from "../models/post/db/post-db";
import { UpdateInputUserType } from "../models/user/input/updateUser-input-model";

export class UserRepository {

  static async create(newUserData: UpdateInputUserType) {
        const newUserId = await usersCollection.insertOne(newUserData);
       return newUserId.insertedId.toString()
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
