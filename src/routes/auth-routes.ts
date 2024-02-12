import express, { Router, Request, Response } from "express";
import {
  RequestWithBody,
} from "../models/common";
import { AuthUserInputModel } from "../models/user/input/authUser-input-model";
import { UserServices } from "../services/userServices";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { jwtServise } from "../utils/JWTservise";
import { jwtValidationMiddleware } from "../auth/jwtAuth-middleware";
export const authRoute = Router({});

authRoute.get(
  "/me", jwtValidationMiddleware,
  async (req: Request, res: Response) => {
  const me = await UserQueryRepository.getById(req.user!.id)
    res.status(200).send(me);
  }
);

authRoute.post(
  "/login",
  async (req: RequestWithBody<AuthUserInputModel>, res: Response) => {
    const {password, loginOrEmail} = req.body
    if (!password || !loginOrEmail){
      res.sendStatus(401);
      return;  
    } 
    const authData = {loginOrEmail:loginOrEmail, password: password }
    const authUsers = await UserServices.checkCredentials(authData) 
    if (!authUsers) {
      res.sendStatus(401); 
      return;
    }
    const accessToken = await jwtServise.createJWT(authUsers)
    res.status(200).send({accessToken});
  }
);