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

  static async delete(deleteUserId: string): Promise<Boolean> {
    const deletePost = await usersCollection.deleteOne({
      _id: new ObjectId(deleteUserId),
    });
    return !!deletePost.deletedCount;
  }
}
