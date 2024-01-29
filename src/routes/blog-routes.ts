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

export const blogRoute = Router({});

blogRoute.get(
  "/",
  async (req: RequestWithQuery<QueryBlogInputModel>, res: Response) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const blogs = await BlogQueryRepository.getAll(sortData);
    if (!blogs) {
      res.status(404);
    }
    res.status(200).send(blogs);
  }
);

blogRoute.get(
  "/:id/posts",
  async (
    req: RequestWithQueryAndParams<Params, QueryPostInputModel>,
    res: Response
  ) => {
    const blogId = req.params.id;
    if (!ObjectId.isValid(blogId)) {
      res.sendStatus(404);
      return;
    }
    const specificiedBlog = await BlogQueryRepository.getById(blogId);
    if (!specificiedBlog) {
      res.sendStatus(404);
      return;
    }
    const postsSortData = {
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const specificiedBlogPosts = await PostQueryRepository.getAll(postsSortData, blogId);
    res.status(200).send(specificiedBlogPosts);
  }
);

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
  "/:id/posts",
  authMiddleware,
  createPostFromBlogValidation(),
  async (
    req: RequestWithBodyAndParams<Params, RequestInputBlogPostType>,
    res: Response
  ) => {
    const blogId = req.params.id;
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
    // console.log("createdPost")
    // console.log(createdPost)
    res.status(201).send(createdPost);
  }
);

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

    const updatedBlog = BlogServices.updateBlog(
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
    const isDeleted = BlogServices.deleteBlog(deleteBlogId);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);
