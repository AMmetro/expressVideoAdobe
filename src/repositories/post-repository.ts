import { WithId, ObjectId } from "mongodb";
import { blogsCollection, postsCollection } from "../BD/db";
import { postMapper } from "../models/post/mapper/post-mapper";
import { OutputPostType } from "../models/post/output/post.output";
import { RequestInputPostType, UpdateInputPostType } from "../models/post/input/updateposts-input-model";
import { PostDB } from "../models/post/db/post-db";
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
      {$set: {updatedPostData}}
    );

    // console.log("postForUpd")
    // console.log(postForUpd)

    return !!postForUpd.modifiedCount;
  }

  static async delete(deletePostId: string): Promise<Boolean> {
    const deletePost = await postsCollection.deleteOne({
      _id: new ObjectId(deletePostId),
    });
    return !!deletePost.deletedCount;
  }
}
