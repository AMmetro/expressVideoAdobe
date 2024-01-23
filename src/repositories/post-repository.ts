import { WithId, ObjectId } from "mongodb";
import { blogsCollection, postsCollection } from "../BD/db";
import { postMapper } from "../models/post/mapper/post-mapper";
import { OutputPostType } from "../models/post/output/post.output";
import { RequestInputPostType, UpdateInputPostType } from "../models/post/input/updateposts-input-model";
import { PostDB } from "../models/post/db/post-db";
export class PostRepository {
  static async getAll(): Promise<OutputPostType[] | null> {
    try {
      const posts: WithId<PostDB>[] = await postsCollection.find({}).toArray();
      return posts.map(postMapper);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  
  static async getById(id: string): Promise<OutputPostType | null> {
    const post = await postsCollection.findOne({
      id: { _id: new ObjectId(id) },
    });
    if (!post) {
      return null;
    }
    return postMapper(post);
  }

  static async create(newPostData: UpdateInputPostType) {
    const appropriateBlog = await blogsCollection.findOne(
      { _id: new ObjectId(newPostData.blogId) }
    );
    if (!appropriateBlog){return null}
    const appropriateBlogName = appropriateBlog?.name
    const newPostId = await postsCollection.insertOne({...newPostData, blogName:appropriateBlogName});
    return newPostId.insertedId.toString();
  }

  static async update(
    updatedPostId: string,
    updatedPostData: RequestInputPostType
  ): Promise<Boolean> {
    const postForUpd = await postsCollection.updateOne(
      { _id: new ObjectId(updatedPostId) },
      {
        $set: {
          title: updatedPostData.title,
          shortDescription: updatedPostData.shortDescription,
          content: updatedPostData.content,
          blogId: updatedPostData.blogId,
        },
      }
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
