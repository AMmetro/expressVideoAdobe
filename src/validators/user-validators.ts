import { body, param } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { usersCollection } from "../BD/db";

export const loginValidator = body("login").isString().withMessage("login must be a string").trim().
isLength({min:3, max:10}).withMessage("Incorect length of login").matches("^[a-zA-Z0-9_-]*$").withMessage("Incorect login")

export const passwordValidator = body("password").isString().withMessage("password must be a string").trim().
isLength({min:6, max:20}).withMessage("Incorect length of password")

export const emailValidator = body("email").isString().withMessage("email must be a string")
.isEmail().withMessage("wrong email type")
// .matches("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$").withMessage("wrong email type validation") 
// .matches("/^[w\-.]+@([w\-]+.)+[w\-]{2,4}$/").withMessage("wrong email type validation") 

export const emailsExistValidator = body("email").custom(async (value: string)=>{
    const existingEmail = await usersCollection.findOne({email: value });
    if (!existingEmail) {
        // false
         throw Error ("existingEmail")
        }
        return true
})

export const userValidation=()=>[loginValidator, passwordValidator, emailValidator, inputValidationMiddleware]




