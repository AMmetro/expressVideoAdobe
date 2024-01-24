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
import { RequestInputPostType, UpdateInputPostType } from "../models/post/input/updateposts-input-model";

export const postRoute = Router({});

postRoute.get("/", async (req: Request, res: Response) => {
  const posts = await PostRepository.getAll();
  if (!posts) {
    res.status(404);
    return
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
      return
    }
    const posts = await PostRepository.getById(id);
    if (!posts) {
      res.sendStatus(404);
      return
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

    const newPostData:UpdateInputPostType = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await PostRepository.create(newPostData);
    if (!createdPost){
         res.sendStatus(404)
          return
        }
    res.status(201).send(createdPost);
  }
);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBodyAndParams<Params, RequestInputPostType>, res: Response) => {
    const id = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const updatedPostData = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const updatedPost = await PostRepository.update(id, updatedPostData);
    if (!updatedPost) {
      res.sendStatus(404);
      return
    }
    res.sendStatus(204);
  }
);

postRoute.delete("/:id", authMiddleware, 
async (req: RequestWithParams<Params>,
res: ResposesType<OutputPostType | null>) => {
  const deletePostId = req.params.id;
  if (!ObjectId.isValid(deletePostId)) {
    res.sendStatus(404);
    return
  }
  const deletePost = await PostRepository.delete(deletePostId);
  if (!deletePost) {
    res.sendStatus(404);
    return
  }
  res.sendStatus(204);
});
