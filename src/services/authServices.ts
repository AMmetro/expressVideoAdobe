import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { basicSortQuery } from "../utils/sortQeryUtils";
import { ResultCode } from "../validators/error-validators";
import { hashServise } from "../utils/JWTservise";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserRepository } from "../repositories/user-repository";
import { emailAdaper } from "../utils/emailAdaper";
import { ObjectId } from "mongodb";

export class AuthServices {
  static async registrationUserWithConfirmation(
    registrationData: RequestInputUserType
  ): Promise<any | null> {
    const { login, password, email } = registrationData;
    const userSearchData = { login: login, email: email };
    const userAllreadyExist = await UserQueryRepository.getOneByLoginOrEmail(
      userSearchData
    );
    if (userAllreadyExist) {
      return {
        status: ResultCode.ClientError,
        // errorMessage: "User allready exist",
        errorMessage: { errorsMessages: [{ message: "Any<String>", field: "email" }] },
      };
    }
    const passwordSalt = await hashServise.generateSalt();
    const passwordHash = await hashServise.generateHash(password, passwordSalt);
    const newUser = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
    };
    const newUserId = await UserRepository.createWithOutConfirmation(newUser);
    if (!newUserId) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "Some error",
      };
    }
    const emailInfo = {
      email: email,
      message: "please confirm email",
      subject: "confirmation",
      confirmationCode: newUser.emailConfirmation!.confirmationCode,
    };
    await emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return {
      status: ResultCode.Success,
      data: true,
    };
  }

  static async confirmEmail(code:string): Promise<any> {
    const userForConfirmation = await UserQueryRepository.getByConfirmationCode(code);
    if (!userForConfirmation) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "If the confirmation code is incorrect, expired or already been applied",
      };
    }
    const isConfirmed = await UserRepository.confirmRegistration(new ObjectId(userForConfirmation.id));
    if (!isConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "If the confirmation code is incorrect, expired or already been applied",
      };
    }
    return {
      status: ResultCode.Success,
      data: isConfirmed,
    };
  }

  static async emailResending(email:string): Promise<any> {
   const userSearchData = { email: email, login:" " }; // search by login " " false for all login 
   const userForEmailResending = await UserQueryRepository.getOneByLoginOrEmail(userSearchData);
   const emailIsConfirmed = userForEmailResending?.emailConfirmation?.isConfirmed
       if (emailIsConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "Email is confirmed",
      };
    }
  // return "userForEmailResending"

    // if (!userForConfirmation) {
    //   return {
    //     status: ResultCode.ClientError,
    //     errorMessage: "If the confirmation code is incorrect, expired or already been applied",
    //   };
    // }
    // const isConfirmed = await UserRepository.confirmRegistration(new ObjectId(userForConfirmation.id));
    // if (!isConfirmed) {
    //   return {
    //     status: ResultCode.ClientError,
    //     errorMessage: "If the confirmation code is incorrect, expired or already been applied",
    //   };
    // }
    return {
      status: ResultCode.Success,
      data: emailIsConfirmed,
    };
  }





  }

