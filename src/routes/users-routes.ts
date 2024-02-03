import express, { Router, Request, Response } from "express";
import { authMiddleware } from "../auth/auth-middleware";
import { blogValidation } from "../validators/blog-validators";
import { BlogRepository } from "../repositories/blog-repository";
import { ObjectId } from "mongodb";
import { OutputBlogType } from "../models/blog/output/blog.output";
import {
  InputBlogType,
  RequestInputBlogType,
} from "../models/blog/input/updateblog-input-model";
import { BlogDB } from "../models/blog/db/blog-db";
import {
  Params,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  RequestWithQuery,
  ResposesType,
  RequestWithQueryAndParams,
} from "../models/common";
import { BlogServices } from "../services/blogServices";
import { sortQueryUtils } from "../utils/sortQeryUtils";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { userValidation } from "../validators/user-validators";
import { QueryUserInputModel } from "../models/user/input/queryUser-input-model";
import { RequestInputPostType } from "../models/post/input/updateposts-input-model";
import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { UserServices } from "../services/userServices";

export const usersRoute = Router({});

usersRoute.get(
  "/",
  async (req: RequestWithQuery<QueryUserInputModel>, res: Response) => {
    const sortData = sortQueryUtils(req.params)
    const users = await UserQueryRepository.getAll(sortData);
    if (!users) {
      res.status(404);
    }
    res.status(200).send(users);
  }
);

usersRoute.post(
  "/",
  authMiddleware,
  userValidation(),
  async (req: RequestWithBody<RequestInputUserType>, res: Response) => {
    const { login, password, email } = req.body;
    const InputUserModel = {
      login: login,
      password: password,
      email: email,
    };
    const createdUser = await UserServices.create(InputUserModel);
    if (!createdUser) {
      res.sendStatus(400);
      return;
    }
    res.status(201).send(createdUser);
  }
);

// usersRoute.post(
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

// usersRoute.put(
//   "/:id",
//   authMiddleware,
//   blogValidation(),
//   async (
//     req: RequestWithBodyAndParams<Params, RequestInputBlogType>,
//     res: Response
//   ) => {
//     const updatedBlogId = req.params.id;
//     if (!ObjectId.isValid(updatedBlogId)) {
//       res.sendStatus(404);
//       return;
//     }
//     const { name, description, websiteUrl } = req.body;
//     const updatedBlogModel = {
//       name: name,
//       description: description,
//       websiteUrl: websiteUrl,
//     };
//     const updatedBlog = await BlogServices.updateBlog(
//       updatedBlogId,
//       updatedBlogModel
//     );
//     if (!updatedBlog) {
//       res.sendStatus(404);
//       return;
//     }
//     res.sendStatus(204);
//   }
// );

// usersRoute.delete(
//   "/:id",
//   authMiddleware,
//   async (req: RequestWithParams<Params>, res: Response) => {
//     const deleteBlogId = req.params.id;
//     if (!ObjectId.isValid(deleteBlogId)) {
//       res.sendStatus(404);
//       return;
//     }
//     const isDeleted = await BlogServices.deleteBlog(deleteBlogId);
//     if (!isDeleted) {
//       res.sendStatus(404);
//       return;
//     }
//     res.sendStatus(204);
//   }
// );
