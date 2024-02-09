import { RequestWithQuery, RequestWithQueryAndParams } from './../models/common';
import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../auth/basicAuth-middleware";
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
import { CommentDB } from '../models/comments/db/comment-db';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { OutputCommentType } from '../models/comments/output/comment.output';

export const commentsRoute = Router({});

commentsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<Params>,
    res: ResposesType<OutputCommentType | null>
  ) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }
    const comment = await CommentsQueryRepository.getById(id);
    if (!comment) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(comment);
  }
);

// commentsRoute.post(
//   "/",
//   authMiddleware,
//   postValidation(),
//   async (req: RequestWithBody<RequestInputPostType>, res: Response) => {
//     const { title, shortDescription, content, blogId } = req.body;
//     const newPostModal = {
//       title: title,
//       shortDescription: shortDescription,
//       content: content,
//       blogId: blogId,
//     };
//     const newPost = await PostServices.create(newPostModal);
//     if (!newPost) {
//       res.sendStatus(404);
//       return;
//     }
//     res.status(201).send(newPost);
//   }
// );

// commentsRoute.put(
//   "/:id",
//   authMiddleware,
//   postValidation(),
//   async (
//     req: RequestWithBodyAndParams<Params, RequestInputPostType>,
//     res: Response
//   ) => {
//     const updatedPostId = req.params.id;
//     if (!ObjectId.isValid(updatedPostId)) {
//       res.sendStatus(404);
//       return;
//     }
//     const postForUpdated = await PostQueryRepository.getById(updatedPostId)
//     if (postForUpdated === null) {
//       res.sendStatus(404);
//       return;
//     }
//     const { title, shortDescription, content, blogId } = req.body;
//     const updatedPostModal = {
//       title: title,
//       shortDescription: shortDescription,
//       content: content,
//       blogId: blogId,
//     };
//     const postIsUpdated = await PostServices.update(updatedPostId, updatedPostModal);
//     if (!postIsUpdated) {
//       res.sendStatus(404);
//       return;
//     }
//     res.sendStatus(204);
//   }
// );

// commentsRoute.delete(
//   "/:id",
//   authMiddleware,
//   async (
//     req: RequestWithParams<Params>,
//     res: ResposesType<OutputPostType | null>
//   ) => {
//     const deletePostId = req.params.id;
//     if (!ObjectId.isValid(deletePostId)) {
//       res.sendStatus(404);
//       return;
//     }
//     const postForDelete = await PostQueryRepository.getById(deletePostId);
//     if (!postForDelete) {
//       res.sendStatus(404);
//       return;
//     }
//     const isDeletePost = await PostServices.delete(deletePostId);
//     // нужно ли перед этм проаерять по айди наличие
//     if (!isDeletePost) {
//       res.sendStatus(404);
//       return;
//     }
//     res.sendStatus(204);
//   }
// );
