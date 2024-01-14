import { body } from "express-validator";
import { BlogRepository } from "../repositories/blog-repository";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";

const titleValidator = body("title").isString().withMessage("title must be a string").trim().
isLength({min:1, max:30}).withMessage("Incorect length of name")

const shortDescriptionValidator = body("shortDescription").isString().withMessage("shortDescription must be a string").trim().
isLength({min:1, max:100}).withMessage("Incorect description")

const contentValidator = body("content").isString().withMessage("content must be a string").trim().
isLength({min:1, max:1000}).matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$").withMessage("Incorect description")

const blogValidator = body("blogId").custom((value)=>{
    const blog= BlogRepository.getById(value);
    if (!blog) {
        throw Error ("incorect blog id")
        }
}).withMessage("incorect blog id")

// const blogValidator = body("blogId").isString().withMessage("blogId must be a string").trim().
// isLength({min:1, max:100}).matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$").withMessage("Incorect description")

export const postValidation=()=>[titleValidator, shortDescriptionValidator, contentValidator, blogValidator, inputValidationMiddleware]


