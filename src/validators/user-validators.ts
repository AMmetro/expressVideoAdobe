import { body, param } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";

export const loginValidator = body("login").isString().withMessage("login must be a string").trim().
isLength({min:3, max:10}).withMessage("Incorect length of login").matches("^[a-zA-Z0-9_-]*$").withMessage("Incorect login")

export const passwordValidator = body("password").isString().withMessage("password must be a string").trim().
isLength({min:6, max:20}).withMessage("Incorect length of password")

export const emailValidator = body("email").isString().withMessage("email must be a string")
.isEmail().withMessage("wrong email")

export const userValidation=()=>[loginValidator, passwordValidator, emailValidator, inputValidationMiddleware]




