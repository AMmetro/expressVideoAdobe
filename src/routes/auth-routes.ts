import express, { Router, Request, Response } from "express";
import { RequestWithBody } from "../models/common";
import {
  AuthUserInputModel,
  RegistrationUserInputModel,
} from "../models/user/input/authUser-input-model";
import { userServices } from "../services/userServices";
import { UserQueryRepository } from "../repositories/user.query-repository";
import {
  jwtValidationAcssTokenMiddleware,
  jwtValidationRefreshTokenMiddleware,
} from "../auth/jwtAuth-middleware";
import {
  emailExistValidator,
  emailIsAplliedValidator,
  emailValidator,
  loginExistValidator,
  loginValidator,
  passwordValidator,
} from "../validators/user-validators";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { AuthServices } from "../services/authServices";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";
import { DevicesServices } from "../services/devicesServices";
import { rateLimitMiddleware } from "../middlewares/rateLimit-middleware";
export const authRoute = Router({});

authRoute.get(
  "/me",
  jwtValidationAcssTokenMiddleware,
  async (req: Request, res: Response) => {
    const me = await UserQueryRepository.getById(req.user!.id);
    if (!me) {
      res.sendStatus(401);
      return;
    }
    const meModel = { userId: me.id, login: me.login, email: me.email };
    res.status(200).send(meModel);
  }
);

authRoute.post(
  "/refresh-token",
  jwtValidationRefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      res.sendStatus(401);
      return;
    }
    const result = await AuthServices.refreshToken(oldRefreshToken);
    if (result.status === ResultCode.Success) {
      res
        .cookie("refreshToken", result.data.newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send({ accessToken: result.data.newAccessToken });
      return;
    } else {
      sendCustomError(res, result);
    }
  }
);

authRoute.post(
  "/login",
  rateLimitMiddleware,
  async (req: RequestWithBody<AuthUserInputModel>, res: Response) => {
    const { password, loginOrEmail } = req.body;
    const userAgent = (res.locals.ua = req.get("User-Agent") || "unknown");
    const userIp = req.ip || "unknown";
    if (!password || !loginOrEmail) {
      res.sendStatus(400);
      return;
    }
    const authData = { loginOrEmail: loginOrEmail, password: password };
    const result = await AuthServices.loginUser(authData, userAgent, userIp);
    if (result.data && result.status === ResultCode.Success) {
      const accessToken = result.data.newAT;
      const refreshToken = result.data.newRT;
      return res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send({ accessToken });
    } else {
      sendCustomError(res, result);
      return;
    }
  }
);

authRoute.post(
  "/logout",
  jwtValidationRefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      res.sendStatus(401);
      return;
    }
    const result = await userServices.logout(oldRefreshToken);
    if (result.status === ResultCode.Success) {
      res.clearCookie("refreshToken").sendStatus(204);
      return;
    } else {
      sendCustomError(res, result);
    }
  }
);

authRoute.post(
  "/registration",
  rateLimitMiddleware,
  passwordValidator,
  emailValidator,
  loginValidator,
  loginExistValidator,
  emailExistValidator,
  inputValidationMiddleware,
  async (req: RequestWithBody<RegistrationUserInputModel>, res: Response) => {
    const { password, login, email } = req.body;
    if (!password || !login || !email) {
      res.sendStatus(401);
      return;
    }
    const registrationData = { login: login, password: password, email: email };
    const result = await AuthServices.registrationUserWithConfirmation(
      registrationData
    );
    if (result.status === ResultCode.Success) {
      res.sendStatus(204);
    } else {
      sendCustomError(res, result);
    }
  }
);

authRoute.post(
  "/registration-confirmation",
  rateLimitMiddleware,
  // inputValidationMiddleware,
  async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const confirmationCode = req.body.code;
    if (!confirmationCode) {
      res.sendStatus(400);
      return;
    }
    const result = await AuthServices.confirmEmail(confirmationCode);
    if (result.status === ResultCode.Success) {
      res.sendStatus(204);
    } else {
      sendCustomError(res, result);
    }
  }
);

authRoute.post(
  "/registration-email-resending",
  rateLimitMiddleware,
  emailValidator,
  emailIsAplliedValidator,
  inputValidationMiddleware,
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const { email } = req.body;
    const result = await AuthServices.emailResending(email);
    if (result.status === ResultCode.Success) {
      res.sendStatus(204);
    } else {
      sendCustomError(res, result);
    }
  }
);

authRoute.post(
  "/password-recovery",
  rateLimitMiddleware,
  emailValidator,
  inputValidationMiddleware,
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const { email } = req.body;
    const result = await AuthServices.sendCodePasswordRecovery(email);
    if (result.status === ResultCode.Success) {
      res.sendStatus(204);
    } else {
      sendCustomError(res, result);
    }
  }
);

authRoute.post(
  "/new-password",
  rateLimitMiddleware,
  async (
    req: RequestWithBody<{ newPassword: string; recoveryCode: string }>,
    res: Response
  ) => {
    const { newPassword, recoveryCode } = req.body;
    const newPasswordIncorrect =
      !newPassword ||
      newPassword.length < 6 ||
      newPassword.length > 20 ||
      typeof newPassword !== "string";
    if (newPasswordIncorrect || !recoveryCode) {
      sendCustomError(res, {
        status: ResultCode.ClientError,
        errorMessage: JSON.stringify({
          errorsMessages: [
            {
              message: `New password is incorrect`,
              field: "newPassword",
            },
          ],
        }),
      });
      return;
    }
    const result = await AuthServices.newPassword(newPassword, recoveryCode);
    if (result.status === ResultCode.Success) {
      res.sendStatus(204);
    } else {
      sendCustomError(res, result);
    }
  }
);
