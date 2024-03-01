import { NextFunction, Request, Response } from "express";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";
import { AuthServices } from "../services/authServices";

export const jwtValidationAcssTokenMiddleware = async (
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
};

export const jwtValidationRefreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.refreshToken) {
    res.sendStatus(401);
    return;
  }
  const result = await AuthServices.checkRefreshToken(req.cookies.refreshToken);
  if (result.status === ResultCode.Success && result.data) {
    req.user = result.data;
    return next();
  } else {
   return sendCustomError(res, result);
  }
};
