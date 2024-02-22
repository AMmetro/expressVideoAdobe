import express, { Router, Request, Response } from "express";
import {
  RequestWithBody,
} from "../models/common";
import { AuthUserInputModel, RegistrationUserInputModel } from "../models/user/input/authUser-input-model";
import { UserServices } from "../services/userServices";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { jwtServise } from "../utils/JWTservise";
import { jwtValidationMiddleware } from "../auth/jwtAuth-middleware";
import { codeExistValidator, emailExistValidator, emailIsAplliedValidator, emailValidator, loginExistValidator, loginValidator, passwordValidator } from "../validators/user-validators";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { AuthServices } from "../services/authServices";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";
import { emailAdaper } from "../utils/emailAdaper";
export const authRoute = Router({});

authRoute.get(
  "/me",
   jwtValidationMiddleware,

  async (req: Request, res: Response) => {
  const me = await UserQueryRepository.getById(req.user!.id)
    res.status(200).send(me);
  }
);

authRoute.post(
  "/refresh-token",
  jwtValidationMiddleware,
  async (req: Request, res: Response) => {
    const refresh_token= req.cookies.refresh_token 
    const userId = await jwtServise.getUserIdByRefreshToken(refresh_token)
     const reAuthUsers = await UserQueryRepository.getById(userId) 
    if (!reAuthUsers) {
      res.sendStatus(401); 
      return;
    }
    const accessToken = await jwtServise.createAccessTokenJWT(reAuthUsers)
    const refreshToken = await jwtServise.createRefreshTokenJWT(reAuthUsers)
    await UserServices.updateRefreshToken(refresh_token, userId)
    return res
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .status(200)
    .send({accessToken});
  }
);

authRoute.post(
  "/login",
  async (req: RequestWithBody<AuthUserInputModel>, res: Response) => {
    const {password, loginOrEmail} = req.body
    if (!password || !loginOrEmail){
      res.sendStatus(400);
      return;  
    } 
    
    // ---------------------------------------

    const emailInfo1 = {
      email: "7656077@mail.ru",
      subject: "111111111111",
      confirmationCode: "refreshToken",
      debug: "refreshToken",
    };
    await emailAdaper.sendEmailDebug(emailInfo1);

    // ---------------------------------------
    const authData = {loginOrEmail:loginOrEmail, password: password }
    const authUsers = await UserServices.checkCredentials(authData) 
    if (!authUsers) {
      res.sendStatus(401); 
      return;
    }
    
    const accessToken = await jwtServise.createAccessTokenJWT(authUsers)
    const refreshToken = await jwtServise.createRefreshTokenJWT(authUsers)

    // ---------------------------------------

    const emailInfo = {
      email: "7656077@mail.ru",
      subject: "2222222222",
      confirmationCode: refreshToken,
      debug: refreshToken,
    };
    await emailAdaper.sendEmailDebug(emailInfo);

    // ---------------------------------------

    return res
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .status(200)
    .send({accessToken});
  }
);

authRoute.post(
  "/logout", jwtValidationMiddleware,
  async (req: Request, res: Response) => {
    const user = await UserQueryRepository.getById(req.user!.id)
    if (!user) {
      res.sendStatus(401); 
      return;
    }
    const refresh_token= req.cookies.refresh_token 
    // добавить юзеру обнуляемый токен в массив блокированных 

    return res
    .clearCookie("refresh_token")
    .sendStatus(204)
  }
);

authRoute.post(
  "/registration",
  passwordValidator,
  emailValidator,
  loginValidator,
  loginExistValidator,
  emailExistValidator,
  inputValidationMiddleware,
  async (req: RequestWithBody<RegistrationUserInputModel>, res: Response) => {
    const {password, login, email} = req.body
    if (!password || !login || !email){
      res.sendStatus(401);
      return;  
    }
    const registrationData = {login:login, password: password, email: email }
    const result = await AuthServices.registrationUserWithConfirmation(registrationData) 
    if (result.status === ResultCode.Success){
      res.sendStatus(204)
    } else {sendCustomError(res, result)}
  }
);

authRoute.post(
  "/registration-confirmation",
  // codeExistValidator,
  // inputValidationMiddleware,
  async (req: RequestWithBody<{code:string}>, res: Response) => {
    const  confirmationCode = req.body.code;
    if (!confirmationCode) {
      res.sendStatus(400);
      return;
    }
    const result = await AuthServices.confirmEmail(confirmationCode);
    if (result.status === ResultCode.Success){
      res.sendStatus(204); 
    } else {sendCustomError(res, result)}
  } 
);

authRoute.post(
  "/registration-email-resending",
  emailValidator,
  emailIsAplliedValidator,
  inputValidationMiddleware,
  async (req: RequestWithBody<{email:string}>, res: Response) => {
    const { email } = req.body;
    const result = await AuthServices.emailResending(email);
      if (result.status === ResultCode.Success){
      res.sendStatus(204);
    } else {sendCustomError(res, result)}
} 
);


