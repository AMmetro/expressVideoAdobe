import { Router, Request, Response } from "express";
import { authMiddleware } from "../auth/basicAuth-middleware";
import { blogValidation } from "../validators/blog-validators";
import { ObjectId } from "mongodb";
import { OutputBlogType } from "../models/blog/output/blog.output";
import {
  RequestInputBlogType,
} from "../models/blog/input/updateblog-input-model";
import {
  Params,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  RequestWithQuery,
  ResposesType,
  RequestWithQueryAndParams,
} from "../models/common";
import { QueryBlogInputModel, QueryPostInputModel } from "../models/blog/input/queryBlog-input-model";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { RequestInputBlogPostType } from "../models/post/input/updateposts-input-model";
import { BlogServices } from "../services/blogServices";
import { createPostFromBlogValidation } from "../validators/post-validators";
import { basicSortQuery } from "../utils/sortQeryUtils";
import { jwtValidationAcssTokenMiddlewareOptional } from "../auth/jwtAuth-middleware";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";

export const blogRoute = Router({});



class BlogsController {

  async getBlogPosts (
    req: RequestWithQueryAndParams<{blogId:string}, QueryPostInputModel>,
    res: Response
  )  {
    const blogId = req.params.blogId;
    const userOptionalId = req.user?.id || null;
    if (!ObjectId.isValid(blogId)) {
      res.sendStatus(404);
      return;
    }
    const basicSortData = basicSortQuery(req.query)
    const result = await BlogServices.composeBlogPosts(blogId, basicSortData, userOptionalId );
    if (result.status === ResultCode.Success){
      res.status(200).send(result.data);
    } else {
      sendCustomError(res, result)
    }
  }


  async createBlogForPost (
      req: RequestWithBodyAndParams<{blogId: string}, RequestInputBlogPostType>,
      res: Response
    ) {
      const blogId = req.params.blogId;
      if (!ObjectId.isValid(blogId)) {
        res.sendStatus(404);
        return;
      }
      const createPostModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
      };
      const createdPost = await BlogServices.createPostToBlog(blogId, createPostModel);
      if (!createdPost) {
        res.sendStatus(404);
        return;
      }
      res.status(201).send(createdPost);
    }


}

const blogsController = new BlogsController()


blogRoute.get(
  "/",
  async (req: RequestWithQuery<QueryBlogInputModel>, res: Response) => {
    const basicSortData = basicSortQuery(req.query)
    const sortData = {...basicSortData, searchNameTerm: req.query.searchNameTerm ?? null}
    const blogs = await BlogQueryRepository.getAllByName(sortData);
    if (!blogs) {
      res.status(404);
    }
    res.status(200).send(blogs);
  }
);

blogRoute.get("/:blogId/posts",
jwtValidationAcssTokenMiddlewareOptional,
blogsController.getBlogPosts);


blogRoute.get(
  "/:id",
  async (
    req: RequestWithParams<Params>,
    res: ResposesType<OutputBlogType | null>
  ) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }
    const blog = await BlogQueryRepository.getById(id);
    if (!blog) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(blog);
  }
);

blogRoute.post(
  "/",
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<RequestInputBlogType>, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const InputBlogModel = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    const createdBlog = await BlogServices.createBlog(InputBlogModel);
    if (!createdBlog) {
      res.sendStatus(400);
      return;
    }
    res.status(201).send(createdBlog);
  }
);

blogRoute.post(
  "/:blogId/posts",
  authMiddleware,
  createPostFromBlogValidation(),
  blogsController.createBlogForPost
);
// blogRoute.post(
//   "/:blogId/posts",
//   authMiddleware,
//   createPostFromBlogValidation(),
//   async (
//     req: RequestWithBodyAndParams<{blogId: string}, RequestInputBlogPostType>,
//     res: Response
//   ) => {
//     const blogId = req.params.blogId;
//     if (!ObjectId.isValid(blogId)) {
//       res.sendStatus(404);
//       return;
//     }
//     const createPostModel = {
//       title: req.body.title,
//       shortDescription: req.body.shortDescription,
//       content: req.body.content,
//     };
//     const createdPost = await BlogServices.createPostToBlog(blogId, createPostModel);
//     if (!createdPost) {
//       res.sendStatus(404);
//       return;
//     }
//     res.status(201).send(createdPost);
//   }
// );

blogRoute.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  async (
    req: RequestWithBodyAndParams<Params, RequestInputBlogType>,
    res: Response
  ) => {
    const updatedBlogId = req.params.id;
    if (!ObjectId.isValid(updatedBlogId)) {
      res.sendStatus(404);
      return;
    }
    const { name, description, websiteUrl } = req.body;
    const updatedBlogModel = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    const updatedBlog = await BlogServices.updateBlog(
      updatedBlogId,
      updatedBlogModel
    );
    if (!updatedBlog) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);

blogRoute.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const deleteBlogId = req.params.id;
    if (!ObjectId.isValid(deleteBlogId)) {
      res.sendStatus(404);
      return;
    }
    const isDeleted = await BlogServices.deleteBlog(deleteBlogId);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);
