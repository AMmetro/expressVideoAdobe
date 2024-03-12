import { body, param } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { CommentModel } from "../BD/db";
import { ObjectId } from "mongodb";

const contentValidator = body("content").isString().withMessage("Content must be a string").trim().
isLength({min:20, max:300}).withMessage("Incorect length of Content")

export const commentValidation=()=>[contentValidator, inputValidationMiddleware]



export const commentExist = param("commentId").custom(
    async (value: string) => {
      const commentForValidation = await CommentModel.findOne({ _id: new ObjectId(value) });
      if (!commentForValidation) {
        // false
        throw Error("not found comment");
      }
      return true;
    }
  );

  export const commentBelongToUserValidation=()=>[commentExist, inputValidationMiddleware]




