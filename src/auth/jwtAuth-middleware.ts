import { NextFunction, Request, Response } from "express";

import { jwtServise } from "../utils/JWTservise";
import { UserQueryRepository } from "../repositories/user.query-repository";

export const jwtValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtServise.getUserIdByAcssToken(token);
  if (userId) {
    const user = await UserQueryRepository.getById(userId);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    req.user = user;
    next();
    return;
  }
  res.sendStatus(401);
};
