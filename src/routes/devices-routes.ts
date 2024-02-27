import { Router, Response } from "express";
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
import { UserQueryRepository } from "../repositories/user.query-repository";

export const devicesRoute = Router({});

devicesRoute.get(
  "/devices",
  jwtValidationMiddleware,
  async (req: Request, res: any ) => {
    const userId = req.user!.id
    if (!ObjectId.isValid(userId)) {
      res.sendStatus(404);
      return;
    }
 
    const user = await UserQueryRepository.getById(userId);



    // if (!comment) {
    //   res.sendStatus(404);
    //   return;
    // }
    // res.status(200).send(comment);
  }
);




