import { WithId, ObjectId } from "mongodb";
import { BlogModel } from "../BD/db";
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

    static async getAllByName(sortData: SortDataType): Promise<PaginationType<OutputBlogType> | null> {
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
    const blogs: WithId<BlogDB>[] = await BlogModel
    .find(filter)
    .sort({[sortBy]: sortDirection})
    .skip((pageNumber-1) * pageSize)
    .limit(pageSize)
    .lean()

    const totalCount = await BlogModel.countDocuments(filter)
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


    static async getAllById(sortData: SortDataType, blogId: string): Promise<PaginationType<OutputBlogType> | null> {
      const { sortBy, sortDirection, pageNumber, pageSize } = sortData
    try {
    const blogs: WithId<BlogDB>[] = await BlogModel
    .find({_id: new ObjectId(blogId)})
    .sort({[sortBy]: sortDirection})
    .skip((pageNumber-1) * pageSize)
    .limit(pageSize)
    .lean()

    const totalCount = await BlogModel.countDocuments({_id: new ObjectId(blogId)})
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
    const blog = await BlogModel.findOne({ _id: new ObjectId(id)});
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  }
  
  static async create(newBlog: InputBlogType): Promise<string> {
    //   try{
    const blogId = await BlogModel.create(newBlog); 
    // console.log(blogId)
    return blogId._id.toString();
    // } catch(e){
    //   console.log(e) 
    // }
    
  }

 
}
