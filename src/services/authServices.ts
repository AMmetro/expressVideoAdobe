import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { ResultCode } from "../validators/error-validators";
import { hashServise } from "../utils/JWTservise";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserRepository } from "../repositories/user-repository";
import { emailAdaper } from "../utils/emailAdaper";

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
        errorMessage: "User allready exist",
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
    const newUserId = await UserRepository.createWithConfirmation(newUser);
    if (!newUserId) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "Some error",
      };
    }  
       const emailInfo = {
      email: newUser.email,
      subject: "confirm Email",
      confirmationCode: newUser.emailConfirmation.confirmationCode,
    };
    await emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return {
      status: ResultCode.Success,
      data: true,
    };
  }
  static async confirmEmail(code: string): Promise<any> {
    const userForConfirmation = await UserQueryRepository.getByConfirmationCode(code);
    if (!userForConfirmation) {
      return {
        status: ResultCode.ClientError,
        errorMessage:
          JSON.stringify({ errorsMessages: [{ message: `Not found user with confirmation code ${code}`, field: "code" }] })
      };
    }
    if (userForConfirmation.emailConfirmation.isConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage:
          JSON.stringify({ errorsMessages: [{ message: `This confirmation code ${code} already been applied`, field: "code" }] })
      };
    }
    if (userForConfirmation.emailConfirmation.expirationDate < new Date()) {
      return {
        status: ResultCode.ClientError,
        errorMessage:
          JSON.stringify({ errorsMessages: [{ message: `Confirmation code ${code} expired`, field: "code" }] })
      };
    }
    const isConfirmed = await UserRepository.confirmRegistration(userForConfirmation.id);
    if (!isConfirmed) {
      return {
        status: ResultCode.Conflict,
        errorMessage:
          `Confirmation code ${code}`,
      };
    }
    return {
      status: ResultCode.Success,
      data: isConfirmed,
    };
  }

  static async emailResending(email: string): Promise<any> {
    const userSearchData = { email: email, login: " " }; // search by login " " false for all login
    const userForEmailResending =
      await UserQueryRepository.getOneByLoginOrEmail(userSearchData);
    if (!userForEmailResending) {
      return {
        status: ResultCode.ClientError,
        errorMessage: JSON.stringify({ errorsMessages: [{ message: `Not found user with ${email}`, field: "email" }] }),
      };
    }
    const emailIsConfirmed =
      userForEmailResending.emailConfirmation?.isConfirmed;
    if (emailIsConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "Email is confirmed already",
      };
    }
    const newConfirmationCode = randomUUID();
    const codeUpd  = await UserRepository.updateConfirmationCode(userForEmailResending._id, newConfirmationCode)
    if (!codeUpd) {
      return {
        status: ResultCode.ServerError,
        errorMessage: "Som eerror",
      };
    }
    const emailInfo = {
      email: userForEmailResending.email,
      confirmationCode: newConfirmationCode,
      subject: "resending confirmation code",
    };
     emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return {
      status: ResultCode.Success,
      data: true,
    };
  }
}
