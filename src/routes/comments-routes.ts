import { Router, Response } from "express";
import { ObjectId } from "mongodb";
import {
  Params,
  RequestWithParams,
  ResposesType,
} from "../models/common";
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { OutputCommentType } from '../models/comments/output/comment.output';
import { jwtValidationAcssTokenMiddleware } from '../auth/jwtAuth-middleware';
import { CommentsServices } from '../services/commentsServices';
import { ResultCode } from '../validators/error-validators';
import { sendCustomError } from '../utils/sendResponse';
import { commentValidation } from '../validators/comment-validators';
import { likeStatusEnum } from "../models/likes/db/likes-db";

export const commentsRoute = Router({});


commentsRoute.put(
  "/:commentId/like-status",
  jwtValidationAcssTokenMiddleware,
  async (
    req: RequestWithParams<{commentId: string}>,
    res: Response,
  ) => {
      // Как проверить что 401 ?????? где авторизация
    const userId = req.user!.id;
    const commentId = req.params.commentId;
    const { likeStatus } = req.body;
    if (!likeStatus &&  !likeStatusEnum.hasOwnProperty(likeStatus)) {
      res.sendStatus(400);
      return;
    }
    if (!commentId) {
      res.sendStatus(400);
      return;
    }
    const result = await CommentsServices.addLike(commentId, likeStatus, userId);
  // --------------------------------------------------
    const composetComment = {
      likesCount: 0,
      dislikesCount: 0,
      userId: 0,
      myStatus: 0,
    }

    res.send(composetComment)
    return
    // --------------------------------------------------

    if (!result) {
      res.sendStatus(401);
      return;
    }
    res.sendStatus(204)
  }
);



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

commentsRoute.put(
  "/:commentId",
  jwtValidationAcssTokenMiddleware,
  commentValidation(),
  async (
    req: RequestWithParams<{commentId:string}>,
    res: Response
  ) => {
    const updateCommentId = req.params.commentId;
    const updaterUserId = req.user!.id;
    const updateContent = req.body.content;
    if (!ObjectId.isValid(updateCommentId)) {
      res.sendStatus(404);
      return;
    }
    const result = await CommentsServices.update(updateCommentId, updateContent, updaterUserId );
    if (result.status === ResultCode.Success){
      res.sendStatus(204)
    }
      else {sendCustomError(res, result)}
  }
);

commentsRoute.delete(
  "/:id",
  jwtValidationAcssTokenMiddleware,
  async (
    req: RequestWithParams<Params>,
    res: Response
  ) => {
    const deleteCommentId = req.params.id;
    const removerId = req.user!.id;
    if (!ObjectId.isValid(deleteCommentId)) {
      res.sendStatus(404);
      return;
    }
    const result = await CommentsServices.delete(deleteCommentId, removerId );
    // sendCustomResponse(res, result)
    if (result.status === ResultCode.Success){
      res.sendStatus(204)
    } else {
      sendCustomError(res, result)
    }
  }
);



