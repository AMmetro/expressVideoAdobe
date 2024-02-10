import { Router, Response } from "express";
import { authMiddleware } from "../auth/basicAuth-middleware";
import { ObjectId } from "mongodb";
import {
  Params,
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../models/common";
import { sortQueryUtils } from "../utils/sortQeryUtils";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { userValidation } from "../validators/user-validators";
import { QueryUserInputModel } from "../models/user/input/queryUser-input-model";
import { RequestInputPostType } from "../models/post/input/updateposts-input-model";
import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { UserServices } from "../services/userServices";

export const usersRoute = Router({});

usersRoute.get(
  "/",
  async (req: RequestWithQuery<QueryUserInputModel>, res: Response) => {
    const sortData = sortQueryUtils(req.query);
    const users = await UserQueryRepository.getAll(sortData);
    if (!users) {
      res.status(404);
    }
    res.status(200).send(users);
  }
);

usersRoute.post(
  "/",
  authMiddleware,
  userValidation(),
  async (req: RequestWithBody<RequestInputUserType>, res: Response) => {
    const { login, password, email } = req.body;
    const InputUserModel = {
      login: login,
      password: password,
      email: email,
    };

    const createdUser = await UserServices.create(InputUserModel);
    if (!createdUser) {
      res.sendStatus(400);
      return;
    }
    res.status(201).send(createdUser);
  }
);

usersRoute.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response) => {
    const deletePostId = req.params.id;
    if (!ObjectId.isValid(deletePostId)) {
      res.sendStatus(404);
      return;
    }
    const isDeleted = await UserServices.delete(deletePostId);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);
