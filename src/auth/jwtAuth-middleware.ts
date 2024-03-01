import { NextFunction, Request, Response } from "express";

import { jwtServise } from "../utils/JWTservise";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { emailAdaper } from "../utils/emailAdaper";
import { UserServices } from "../services/userServices";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";
import { AuthServices } from "../services/authServices";

export const jwtValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }
  const result = await AuthServices.checkAcssesToken(req.headers.authorization);
  if (result.status === ResultCode.Success && result.data) {
    req.user = result.data;
    return next();
  } else {
   return sendCustomError(res, result);
  }

  // return res.sendStatus(401);
};
