import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { BlogModel } from "../BD/db";
// import { blogsCollection } from "../BD/db";

const titleValidator = body("title").isString().withMessage("title must be a string").trim().
isLength({min:1, max:30}).withMessage("Incorect length of name")

const shortDescriptionValidator = body("shortDescription").isString().withMessage("shortDescription must be a string").trim().
isLength({min:1, max:100}).withMessage("Incorect description")

const contentValidator = body("content").isString().withMessage("content must be a string").trim().
isLength({min:1, max:1000})
// .matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$").withMessage("Incorect description")

const blogValidator = body("blogId").custom(async (value)=>{
    if (!ObjectId.isValid(value)){
        //return false
        throw new Error("incorect blogId")
    }
    const blog = await BlogModel.findOne({_id:new ObjectId(value)});
    if (!blog) {
        // false
         throw Error ("incorect blogId")
        }
        return true
})
.withMessage("incorect blogId")


const blogValidatorParam = param("blogId").custom(async (value: string)=>{
    if (!ObjectId.isValid(value)){
        //return false
        throw new Error("incorect blogId Query1")
    }
    const blog = await BlogModel.findOne({_id:new ObjectId(value)});
    if (!blog) {
        // false
         throw Error ("incorect blogId Query2")
        }
        return true
})
// .withMessage("incorect blogId Query3")

// const blogValidator = body("blogId").isString().withMessage("blogId must be a string").trim().
// isLength({min:1, max:100}).matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$").withMessage("Incorect description")

export const postValidation=()=>[titleValidator, shortDescriptionValidator, contentValidator, blogValidator, inputValidationMiddleware]

export const createPostFromBlogValidation=()=>[titleValidator, shortDescriptionValidator, contentValidator, inputValidationMiddleware]



