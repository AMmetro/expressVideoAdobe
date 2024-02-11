import { RequestWithQuery, RequestWithQueryAndParams } from './../models/common';
import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";

import {
  Params,
  RequestWithParams,
  ResposesType,
} from "../models/common";


import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { OutputCommentType } from '../models/comments/output/comment.output';
import { jwtValidationMiddleware } from '../auth/jwtAuth-middleware';
import { CommentsServices } from '../services/commentsServices';
import { ResultCode } from '../validators/error-validators';
import { sendCustomError } from '../utils/sendResponse';
import { commentValidation } from '../validators/comment-validators';

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

commentsRoute.put(
  "/:commentId",
  jwtValidationMiddleware,
  commentValidation(),
  async (
    req: RequestWithParams<Params>,
    res: Response
  ) => {
    const updateCommentId = req.params.id;
    const updaterUserId = req.user!.id;
    const updateContent = req.body.content;
    if (!ObjectId.isValid(updateCommentId)) {
      res.sendStatus(404);
      return;
    }
    const result = await CommentsServices.update(updateCommentId, updateContent, updaterUserId );
    if (result.status === ResultCode.Success){
      res.status(204);}
      else {sendCustomError(res, result)}
  }
);

commentsRoute.delete(
  "/:id",
  jwtValidationMiddleware,
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
    } else {sendCustomError(res, result)}

  //   }else if (result.status === ResultCode.NotFound){
  //       res.status(404).send(`${result.errorMessage}`);
  //     return;
  //   }else if (result.status === ResultCode.Forbidden){
  //     res.status(403).send(`${result.errorMessage}`);
  //     return;
  //   }else if (result.status === ResultCode.ServerError){
  //     res.status(503).send(`${result.errorMessage}`);
  //     return;
  //   }
  }
);



