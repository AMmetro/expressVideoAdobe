import express, { Router, Request, Response } from "express";
import { authMiddleware } from "../auth/auth-middleware";
import { blogValidation } from "../validators/blog-validators";
import { BlogRepository } from "../repositories/blog-repository";
import { ObjectId } from "mongodb";
import { OutputBlogType } from "../models/blog/output/blog.output";
import { InputBlogType, RequestInputBlogType } from "../models/blog/input/updateblog-input-model";
import { BlogDB } from "../models/blog/db/blog-db";
import { Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams, ResposesType } from "../models/common";

export const blogRoute = Router({});

blogRoute.get("/", async (req: Request, res: Response) => {
  const blogs = await BlogRepository.getAll();
  if (!blogs) {
    res.status(404);
  }
  res.status(200).send(blogs); 
});

blogRoute.get("/:id", async (req: RequestWithParams<Params>, res: ResposesType<OutputBlogType | null>) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(404);
  }

  const blog = await BlogRepository.getById(id);
  if (!blog) {
    res.sendStatus(404);
    // return
  }
  res.status(200).send(blog); 
});

blogRoute.post("/",authMiddleware,blogValidation(),
  async (req: RequestWithBody<RequestInputBlogType>, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const newBlog: BlogDB = {
      name: name, 
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
      isMemberShip: true,
    };

    const createdBlogId = await BlogRepository.create(newBlog);
    const createdBlog = await BlogRepository.getById(createdBlogId);
    // const createdBlog =async ()=> await BlogRepository.create(newBlog).then(createdBlogId=>BlogRepository.getById(createdBlogId))

    res.status(201).send(createdBlog);
  }
);

blogRoute.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBodyAndParams<Params, RequestInputBlogType>, res: Response) => {
    const updatedBlogId = req.params.id;
    if (!ObjectId.isValid(updatedBlogId)) {
      res.sendStatus(404);
    }

    const { name, description, websiteUrl } = req.body;
    const updatedBlogData = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    const createdBlog = await BlogRepository.update(
      updatedBlogId,
      updatedBlogData
    );
    if (!createdBlog) {
      res.sendStatus(404);
    }
    res.sendStatus(204);
  }
);

blogRoute.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const deleteBlogId = req.params.id;

    if (!ObjectId.isValid(deleteBlogId)) {
      res.sendStatus(404);
    }

    const isDeleted = await BlogRepository.delete(deleteBlogId);
    if (!isDeleted) {
      res.sendStatus(404);
    }
    res.sendStatus(204);
  }
);
