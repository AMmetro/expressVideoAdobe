import {
  CommentParams,
  RequestWithQuery,
} from "./../models/common";
import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../auth/basicAuth-middleware";
import { postValidation } from "../validators/post-validators";
import { OutputPostType } from "../models/post/output/post.output";
import {
  Params,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  ResposesType,
} from "../models/common";
import {
  RequestInputPostType,
} from "../models/post/input/updateposts-input-model";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { PostServices } from "../services/postServices";
import { QueryPostInputModel } from "../models/blog/input/queryBlog-input-model";
import { basicSortQuery } from "../utils/sortQeryUtils";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { CommentsServices } from "../services/commentsServices";
import { jwtValidationMiddleware } from "../auth/jwtAuth-middleware";
import { commentValidation } from "../validators/comment-validators";
import { ResultCode } from "../validators/error-validators";
import { sendCustomResponse } from "../utils/sendResponse";

export const postRoute = Router({});

postRoute.get(
  "/",
  async (req: RequestWithQuery<QueryPostInputModel>, res: Response) => {
    const postsRequestsSortData = basicSortQuery(req.query)
    const posts = await PostQueryRepository.getAll(postsRequestsSortData);
    if (!posts) {
      res.status(404);
      return;
    }
    res.status(200).send(posts);
  }
);

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

// ------------------------------------------------------------
postRoute.get(
  "/:postId/comments",
  async (req: RequestWithParams<CommentParams>, res: Response) => {
    const id = req.params.postId;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }
    const basicSortData = basicSortQuery(req.query);
    const sortData = { id: id, ...basicSortData };
    const comment = await CommentsQueryRepository.getAll(sortData);
    if (!comment) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(comment);
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

// ----------------------------------------------
postRoute.post(
  "/:postId/comments",
  jwtValidationMiddleware,
  commentValidation(),
  async (req: RequestWithParams<CommentParams>, res: Response) => {
    const commentedPostId = req.params.postId;
    const userCommentatorId = req.user!.id;
    const content = req.body.content;

    if (!ObjectId.isValid(commentedPostId)) {
      res.sendStatus(404);
      return;
    }

    const result = await CommentsServices.create(commentedPostId, userCommentatorId, content );
    sendCustomResponse(res, result)
    if (result.status === ResultCode.Success){
      res.status(201).send(result.data);
    }else if (result.status === ResultCode.NotFound){
        res.status(404).send(`${result.errorMessage}`);
      return;
    }else if (result.status === ResultCode.Forbidden){
      res.status(403).send(`${result.errorMessage}`);
      return;
    }else if (result.status === ResultCode.ServerError){
      res.status(503).send(`${result.errorMessage}`);
      return;
    }

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
    const updatedPostId = req.params.id;
    if (!ObjectId.isValid(updatedPostId)) {
      res.sendStatus(404);
      return;
    }
    const postForUpdated = await PostQueryRepository.getById(updatedPostId);
    if (postForUpdated === null) {
      res.sendStatus(404);
      return;
    }
    const { title, shortDescription, content, blogId } = req.body;
    const updatedPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const postIsUpdated = await PostServices.update(
      updatedPostId,
      updatedPostModal
    );
    if (!postIsUpdated) {
      res.sendStatus(404);
      return;
    }
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
    const postForDelete = await PostQueryRepository.getById(deletePostId);
    if (!postForDelete) {
      res.sendStatus(404);
      return;
    }
    const isDeletePost = await PostServices.delete(deletePostId);
    // нужно ли перед этм проаерять по айди наличие
    if (!isDeletePost) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);


