import { WithId, ObjectId } from "mongodb";
import { blogsCollection, db } from "../BD/db";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { BlogDB } from "../models/blog/db/blog-db";
import { blogMapper } from "../models/blog/mapper/blog-mapper";
import { InputBlogType, UpdateBlogType } from "../models/blog/input/updateblog-input-model";

export class BlogRepository {
    static async getAll(): Promise<OutputBlogType[] | null> {
    try {
    const blogs: WithId<BlogDB>[] = await blogsCollection.find({}).toArray();
    return blogs.map(blogMapper);
    }catch (e){
      console.log(e)
      return null 
    }
  }

  static async getById(id: any): Promise<OutputBlogType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  }
  static async create(newBlog: InputBlogType): Promise<String> {
    // try{
    const blogId = await blogsCollection.insertOne(newBlog); 
    // console.log(blogId)
    return blogId.insertedId.toString();
    // } catch(e){
    //   console.log(e) 
    // }
    
  }

  static async update(
    updatedBlogId: string,
    updatedBlogData: UpdateBlogType 
  ): Promise<Boolean> { 
    try { 
      const blogForUpd = await blogsCollection.updateOne(
        { _id: new ObjectId(updatedBlogId) },
        {
          $set: {
            name: updatedBlogData.name,
            description: updatedBlogData.description,
            websiteUrl: updatedBlogData.websiteUrl,
          },
        }
      );
      return !!blogForUpd.matchedCount;
      // ИЛИ true / false
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async delete(deleteBlogId: string): Promise<Boolean> {
    const blogForDelete = await blogsCollection.deleteOne({
      _id: new ObjectId(deleteBlogId),
    });

     return !!blogForDelete.deletedCount;
  }
}
