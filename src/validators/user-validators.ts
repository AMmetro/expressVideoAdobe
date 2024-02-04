import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { BlogRepository } from "../repositories/blog-repository";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { blogsCollection } from "../BD/db";

const loginValidator = body("login").isString().withMessage("login must be a string").trim().
isLength({min:3, max:10}).withMessage("Incorect length of login").matches("^[a-zA-Z0-9_-]*$").withMessage("Incorect login")

const passwordValidator = body("password").isString().withMessage("password must be a string").trim().
isLength({min:6, max:20}).withMessage("Incorect length of password")

const emailValidator = body("email").isString().withMessage("email must be a string").matches("^[a-zA-Z0-9_-]*$").withMessage("wrong symbol for email")
// .isString().withMessage("email must be a string").matches("^[a-zA-Z0-9_-]*$")
// const shortDescriptionValidator = body("shortDescription").isString().withMessage("shortDescription must be a string").trim().
// isLength({min:1, max:100}).withMessage("Incorect description")

// const contentValidator = body("content").isString().withMessage("content must be a string").trim().
// isLength({min:1, max:1000})

// const blogValidator = body("blogId").custom(async (value)=>{
//     if (!ObjectId.isValid(value)){
//         //return false
//         throw new Error("incorect blogId")
//     }
//     const blog = await blogsCollection.findOne({_id:new ObjectId(value)});
//     if (!blog) {
//         // false
//          throw Error ("incorect blogId")
//         }
//         return true
// })
// .withMessage("incorect blogId")


// const blogValidatorParam = param("blogId").custom(async (value: string)=>{
//     if (!ObjectId.isValid(value)){
//         //return false
//         throw new Error("incorect blogId Query1")
//     }
//     const blog = await blogsCollection.findOne({_id:new ObjectId(value)});
//     if (!blog) {
//         // false
//          throw Error ("incorect blogId Query2")
//         }
//         return true
// })
// .withMessage("incorect blogId Query3")

// const blogValidator = body("blogId").isString().withMessage("blogId must be a string").trim().
// isLength({min:1, max:100}).matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$").withMessage("Incorect description")

export const userValidation=()=>[loginValidator, passwordValidator, emailValidator, inputValidationMiddleware]

// export const createPostFromBlogValidation=()=>[titleValidator, shortDescriptionValidator, contentValidator, inputValidationMiddleware]



