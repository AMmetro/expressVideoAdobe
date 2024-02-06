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
import { QueryBlogInputModel, QueryPostInputModel } from "../models/blog/input/queryBlog-input-model";
import { BlogQueryRepository } from "../repositories/blog.query-repository";
import { PostDB } from "../models/post/db/post-db";
import { RequestInputBlogPostType } from "../models/post/input/updateposts-input-model";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { BlogServices } from "../services/blogServices";
import { OutputPostType } from "../models/post/output/post.output";
import { PostServices } from "../services/postServices";
import { createPostFromBlogValidation, postValidation } from "../validators/post-validators";
import { sortQueryUtils } from "../utils/sortQeryUtils";
import { AuthUserInputModel } from "../models/user/input/authUser-input-model";
import { UserServices } from "../services/userServices";
import { UserQueryRepository } from "../repositories/user.query-repository";

export const authRoute = Router({});

authRoute.post(
  "/login",
  // blogValidation(),
  async (req: RequestWithBody<AuthUserInputModel>, res: Response) => {
    const {login, email, password, loginOrEmail} = req.body
    // if ( !password || (!login && !email) || (login && email) ){
    if ( !password || !loginOrEmail ){
      res.sendStatus(401);
      return; 
    } 
    // const authData = {loginOrEmail: login ? login : email!, password: password }
    const authData = {loginOrEmail:loginOrEmail, password: password }
    const authUsers = await UserServices.auth(authData) 
    if (!authUsers) {
      res.sendStatus(401);
      return;
    }
    res.sendStatus(204);
  }
);