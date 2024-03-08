import { WithId, ObjectId } from "mongodb";
import { BlogModel} from "../BD/db";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { BlogDB } from "../models/blog/db/blog-db";
import { blogMapper } from "../models/blog/mapper/blog-mapper";
import { InputBlogType, UpdateBlogType } from "../models/blog/input/updateblog-input-model";

export class BlogRepository {
  
  static async create(newBlog: InputBlogType): Promise<string | null> {
      try{
    // const blogId = await BlogModel.create(newBlog); 
    const blogId = await BlogModel.create(newBlog); 
  // **
  // * const blog2Method = new BlogModel (newBlog) 
  // * blog2Method.save() 
  // **
    // return blogId.insertedId.toString();
    return "blogId.insertedId.toString()";
    } catch(e){
      console.log(e) 
      return null
    } 
  }

  static async getById(id: string): Promise<OutputBlogType | null> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id)});
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  }

  static async update(
    updatedBlogId: string,
    updatedBlogData: UpdateBlogType 
  ): Promise<Boolean> { 
    try { 
      const blogForUpd = await BlogModel.updateOne(
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
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async delete(deleteBlogId: string): Promise<Boolean> {
    const blogForDelete = await BlogModel.deleteOne({
      _id: new ObjectId(deleteBlogId),
    });

     return !!blogForDelete.deletedCount;
  }
}
