import { body, param } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import { usersCollection } from "../BD/db";

export const loginValidator = body("login")
  .isString()
  .withMessage("login must be a string")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Incorect length of login")
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("Incorect login");

export const passwordValidator = body("password")
  .isString()
  .withMessage("password must be a string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorect length of password");

export const emailValidator = body("email")
  .isString()
  .withMessage("email must be a string")
  .isEmail()
  .withMessage("wrong email type");
// .matches("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$").withMessage("wrong email type validation")

export const emailExistValidator = body("email").custom(
  async (value: string) => {
    const existingEmail = await usersCollection.findOne({ email: value });
    if (existingEmail) {
      // false
      throw Error("email already exist");
    }
    return true;
  }
);

export const codeExistValidator = body("code").custom(
  async (value: string) => {
    const existingUser  = await usersCollection.findOne({ "emailConfirmation.confirmationCode": value })
    if (!existingUser) {
      // false
      throw Error(`user with code ${value} not found`);
    }
    return true;
  }
);

export const loginExistValidator = body("login").custom(
  async (value: string) => {
    const existingLogin = await usersCollection.findOne({ login: value });
    if (existingLogin) {
      // false
      throw Error("login already exist");
    }
    return true;
  }
);

export const emailIsAplliedValidator = body("email").custom(
  async (value: string) => {
    const userForValidation = await usersCollection.findOne({ email: value });
    const emailIsApllied = userForValidation?.emailConfirmation?.isConfirmed;
    if (emailIsApllied) {
      // false
      throw Error("email is already applied");
    }
    return true;
  }
);

export const userValidation = () => [
  loginValidator,
  passwordValidator,
  emailValidator,
  inputValidationMiddleware,
];

// export const emailOrLoginExistValidation=()=>[emailExistValidator, loginExistValidator, inputValidationMiddleware]
