import { RequestWithQuery, RequestWithQueryAndParams } from './../models/common';
import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../auth/auth-middleware";
import { postValidation } from "../validators/post-validators";
import { PostRepository } from "../repositories/post-repository";
import { OutputPostType } from "../models/post/output/post.output";
import {
  Params,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  ResposesType,
} from "../models/common";
import {
  RequestInputBlogPostType,
  RequestInputPostType,
  UpdateInputPostType,
} from "../models/post/input/updateposts-input-model";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { PostServices } from "../services/postServices";
import { QueryPostInputModel } from '../models/blog/input/queryBlog-input-model';

export const postRoute = Router({});

postRoute.get("/", async (req: RequestWithQuery<QueryPostInputModel>, res: Response) => {
  const postsRequestsSortData = {
    sortBy: req.query.sortBy ?? "createdAt",
    sortDirection: req.query.sortDirection ?? "desc",
    pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
    pageSize: req.query.pageSize ? +req.query.pageSize : 10,
  };
  const posts = await PostQueryRepository.getAll(postsRequestsSortData);
  if (!posts) {
    res.status(404);
    return;
  }
  res.status(200).send(posts);
});

postRoute.get(
  "/:id",
  async (
    req: RequestWithParams<Params>,
    res: ResposesType<OutputPostType | null>
  ) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }
    const posts = await PostQueryRepository.getById(id);
    if (!posts) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(posts);
  }
);

postRoute.post(
  "/",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBody<RequestInputPostType>, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;

    const newPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const newPost = await PostServices.create(newPostModal);
    if (!newPost) {
      res.sendStatus(404);
      return;
    }
    res.status(201).send(newPost);
  }
);

// нет такого метода
postRoute.post(
  "/:id/posts",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBodyAndParams<Params, RequestInputBlogPostType>, res: Response) => {
    const blogId = req.params.id;
    if (!ObjectId.isValid(blogId)) {
      res.sendStatus(404);
      return;
    }
    const specifiedBlog = await PostQueryRepository.getById(blogId); 
    if (!specifiedBlog) {
      res.sendStatus(404);
      return;
    }
    const { title, shortDescription, content } = req.body;
    const newPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const newPost = await PostServices.create(newPostModal);
    if (!newPost) {
      res.sendStatus(404);
      return;
    }
    res.status(201).send(newPost);
  }
);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation(),
  async (
    req: RequestWithBodyAndParams<Params, RequestInputPostType>,
    res: Response
  ) => {
    const id = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const updatedPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const postIsUpdated = await PostServices.update(id, updatedPostModal);
    if (postIsUpdated === null) {
      res.sendStatus(404);
      return;
    }
    // if (!postIsUpdated) {
    //   res.sendStatus(400);
    //   return;
    // }
    res.sendStatus(204);
  }
);

postRoute.delete(
  "/:id",
  authMiddleware,
  async (
    req: RequestWithParams<Params>,
    res: ResposesType<OutputPostType | null>
  ) => {
    const deletePostId = req.params.id;
    if (!ObjectId.isValid(deletePostId)) {
      res.sendStatus(404);
      return;
    }
    const deletePost = await PostServices.delete(deletePostId);
    // нужно ли перед этм проаерять по айди наличие
    if (!deletePost) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);
