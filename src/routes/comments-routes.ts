import { Router, Response } from "express";
import { ObjectId } from "mongodb";
import {
  Params,
  RequestWithParams,
  ResposesType,
} from "../models/common";
import { OutputCommentType } from '../models/comments/output/comment.output';
import { jwtValidationAcssTokenMiddleware, jwtValidationAcssTokenMiddlewareOptional } from '../auth/jwtAuth-middleware';
import { CommentsServices } from '../services/commentsServices';
import { ResultCode } from '../validators/error-validators';
import { sendCustomError } from '../utils/sendResponse';
import { commentValidation } from '../validators/comment-validators';
import { likeStatusEnum } from "../models/likes/db/likes-db";
import { AuthServices } from "../services/authServices";

export const commentsRoute = Router({});

commentsRoute.put(
  "/:commentId/like-status",
  jwtValidationAcssTokenMiddleware,
  async (
    req: RequestWithParams<{commentId: string}>,
    res: Response,
  ) => {
    const userId = req.user!.id;
    const commentId = req.params.commentId;
    const { likeStatus } = req.body;
      if (!likeStatus ||  !likeStatusEnum.hasOwnProperty(likeStatus)) {
        const error = {
          status: ResultCode.ClientError,
          errorMessage: JSON.stringify({
            errorsMessages: [
              {
                message: `Like status is wrong`,
                field: "likeStatus",
              },
            ],
          })
        }
        sendCustomError(res, error)
        return;
      }
    if (!commentId) {
      res.sendStatus(400);
      return;
    }
    const result = await CommentsServices.addLikeToComment(commentId, likeStatus, userId);
    if (result.status === ResultCode.Success){
      res.sendStatus(204);
    }
    else {sendCustomError(res, result)}
  }
);

commentsRoute.get(
  "/:id",
  jwtValidationAcssTokenMiddlewareOptional,
  async (
    req: RequestWithParams<Params>,
    res: ResposesType<OutputCommentType | null>
  ) => {
    const userOptionalId = req.user?.id || null;
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }

    const result = await CommentsServices.composeComment(id, userOptionalId);
    if (result.status === ResultCode.Success){
      res.status(200).send(result.data as OutputCommentType);
    }
    else {sendCustomError(res, result)}
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
    if (result.status === ResultCode.Success){
      res.sendStatus(204)
    } else {
      sendCustomError(res, result)
    }
  }
);



