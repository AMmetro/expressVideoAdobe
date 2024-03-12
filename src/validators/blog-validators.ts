import { body } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";

const nameValidator = body("name").isString().withMessage("Name must be a string").trim().
isLength({min:1, max:15}).withMessage("Incorect length of name")

const descriptionValidator = body("description").isString().withMessage("description must be a string").trim().
isLength({min:1, max:500}).withMessage("Incorect description")

const websiteUrlValidator = body("websiteUrl").isString().withMessage("WebSiteUrl must be a string").trim().
isLength({min:1, max:100}).matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$").withMessage("Incorect description")

export const blogValidation=()=>[nameValidator, descriptionValidator, websiteUrlValidator, inputValidationMiddleware]


