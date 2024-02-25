import { NextFunction, Request, Response } from "express";

import { jwtServise } from "../utils/JWTservise";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { emailAdaper } from "../utils/emailAdaper";
import { UserServices } from "../services/userServices";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";

export const jwtValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    // -----------------------------------------------------------
    // const emailInfo1 = {
    //   email: "7656077@mail.ru",
    //   confirmationCode: JSON.stringify(req.headers.authorization),
    //   subject: "authorization",
    // };
    //  emailAdaper.sendEmailRecoveryMessage(emailInfo1);
    // -----------------------------------------------------------

    res.sendStatus(401);
    return;
  }

  // ----------------------------------------------------------
  // // вынесено в отдельную функцию для возможности тестирвоания
  // const checkAcssesToken = async (authRequest: string) => {
  //   const token = authRequest.split(" ");
    
  //   const authMethod = token[0];
  //   if (authMethod !== "Bearer") {
  //     return {
  //       status: ResultCode.Unauthorised,
  //       errorMessage: "auth method is not Bearer",
  //     };
  //   }

  //   const userId = await jwtServise.getUserIdByAcssToken(token[1]);
  //   if (userId) {
  //     const user = await UserQueryRepository.getById(userId);
  //     if (!user) {
  //       return {
  //         status: ResultCode.Unauthorised,
  //         errorMessage: "Not found user with id " + userId,
  //       };
  //     }
  //     return {
  //       status: ResultCode.Success,
  //       data: user,
  //     };
  //   }
  //   return {
  //     status: ResultCode.Unauthorised,
  //     errorMessage: "JWT is broken",
  //   };
  // };

  // const result = await checkAcssesToken(req.headers.authorization);
  // if (result.status === ResultCode.Success && result.data) {
  //   req.user = result.data;
  //   return next();
  // } else {
  //   sendCustomError(res, result);
  // }

  // ----------------------------------------------------------
  if (req.headers.authorization.split(" ")[0] !== "Bearer") {
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
