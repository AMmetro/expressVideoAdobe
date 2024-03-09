import { WithId, ObjectId } from "mongodb";
import { blogsCollection, db } from "../BD/db";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { BlogDB } from "../models/blog/db/blog-db";
import { blogMapper } from "../models/blog/mapper/blog-mapper";
import { InputBlogType, UpdateBlogType } from "../models/blog/input/updateblog-input-model";
import { QueryBlogInputModel } from "../models/blog/input/queryBlog-input-model";
import {SortDirection} from "mongodb"
import { PaginationType } from "../models/common";

type SortDataType = {
  searchNameTerm?: string | null,
  sortBy: string,
  sortDirection: SortDirection,
  pageNumber: number,
  pageSize: number,
}


export class BlogQueryRepository {

    static async getAll(sortData: SortDataType): Promise<PaginationType<OutputBlogType> | null> {
      const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sortData
      let filter = {}
      if (searchNameTerm){
        filter = {
          name: {
            $regex: searchNameTerm,
            $options: 'i'
          }
        }
      }
    try {
    const blogs: WithId<BlogDB>[] = await blogsCollection
    .find(filter)
    .sort(sortBy, sortDirection)
    .skip((pageNumber-1) * pageSize)
    .limit(pageSize)
    .toArray();

    const totalCount = await blogsCollection.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs.map(blogMapper),
    } 
    }catch (e){
      console.log(e)
      return null 
    }
  }

  static async getById(id: string): Promise<OutputBlogType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id)});
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  }
  
  static async create(newBlog: InputBlogType): Promise<string> {
    //   try{
    const blogId = await blogsCollection.insertOne(newBlog); 
    // console.log(blogId)
    return blogId.insertedId.toString();
    // } catch(e){
    //   console.log(e) 
    // }
    
  }

 
}
