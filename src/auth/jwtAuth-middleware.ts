import { NextFunction, Request, Response } from "express";

import { jwtServise } from "../utils/JWTservise";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { emailAdaper } from "../utils/emailAdaper";

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
                  // -----------------------------------------------------------
                  const emailInfo1 = {
                    email: "7656077@mail.ru",
                    confirmationCode: "1111111111111",
                    subject: "NO USER",
                  };
                   emailAdaper.sendEmailRecoveryMessage(emailInfo1);
                  // -----------------------------------------------------------
      res.sendStatus(401);
      return;
    }
    req.user = user;
    next();
    return;
  }
                    // -----------------------------------------------------------
                    const emailInfo1 = {
                      email: "7656077@mail.ru",
                      confirmationCode: "222222222222",
                      subject: "&&&&",
                    };
                     emailAdaper.sendEmailRecoveryMessage(emailInfo1);
                    // -----------------------------------------------------------
  res.sendStatus(401);
};
