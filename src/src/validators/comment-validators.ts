import { body } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";

const contentValidator = body("content").isString().withMessage("Content must be a string").trim().
isLength({min:20, max:300}).withMessage("Incorect length of Content")

export const commentValidation=()=>[contentValidator, inputValidationMiddleware]


