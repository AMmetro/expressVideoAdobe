import express, { Router, Request, Response } from "express";
import {
  RequestWithBody,
} from "../models/common";
import { AuthUserInputModel, RegistrationUserInputModel } from "../models/user/input/authUser-input-model";
import { UserServices } from "../services/userServices";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { jwtServise } from "../utils/JWTservise";
import { jwtValidationMiddleware } from "../auth/jwtAuth-middleware";
import { emailExistValidator, emailValidator, loginExistValidator, loginValidator, passwordValidator } from "../validators/user-validators";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { AuthServices } from "../services/authServices";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";
export const authRoute = Router({});

authRoute.get(
  "/me", jwtValidationMiddleware,
  async (req: Request, res: Response) => {
  const me = await UserQueryRepository.getById(req.user!.id)
    res.status(200).send(me);
  }
);

authRoute.post(
  "/registration",
  passwordValidator,
  emailValidator,
  loginValidator,
  emailExistValidator,
  loginExistValidator,
  // emailOrLoginExistValidation,
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
  async (req: RequestWithBody<{code:string}>, res: Response) => {
    const { code } = req.body;
    if (!code) {
      res.sendStatus(400);
      return;
    }
    const result = await AuthServices.confirmEmail(code);
    if (result.status === ResultCode.Success){
      res.sendStatus(204); 
    } else {sendCustomError(res, result)}
  } 
);

// --------------------------------------------
// authRoute.get(
//   "/registration-confirmation",
//   async (req: RequestWithBody<{code:string}>, res: Response) => {
//  res.send("hello")
//   }
// );
// ----------------------------------------------

authRoute.post(
  "/registration-email-resending",
  emailValidator,
  async (req: RequestWithBody<{email:string}>, res: Response) => {
    const { email } = req.body;
    const result = await AuthServices.emailResending(email);
    // res.status(200).send(result);
      if (result.status === ResultCode.Success){
      res.sendStatus(204);
    } else {sendCustomError(res, result)}
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