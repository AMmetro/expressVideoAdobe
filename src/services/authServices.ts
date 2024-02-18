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
      // data: newUser,
    };
  }

  static async confirmEmail(code: string): Promise<any> {
    const userForConfirmation = await UserQueryRepository.getByConfirmationCode(code);
    // !userForConfirmation

    const emailInfo = {
      email: "7656077@mail.ru",
      subject: "debug",
      confirmationCode: JSON.stringify(userForConfirmation),
    }

    // @ts-ignore
    await emailAdaper.sendEmailRecoveryMessage(emailInfo)


    if (userForConfirmation) {
      return {
        status: ResultCode.ClientError,
        errorMessage:
          `Not found user with this confirmation code ${code}`,
      };
    }
    const isConfirmed = await UserRepository.confirmRegistration(
      // @ts-ignore
      new ObjectId(userForConfirmation.id)
    );
    if (!isConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage:
          `The confirmation code ${code} expired or already been applied`,
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
        status: ResultCode.NotFound,
        errorMessage: "Not found user with this email",
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
    await UserRepository.updateConfirmationCode(userForEmailResending._id, newConfirmationCode)
    const emailInfo = {
      email: userForEmailResending.email,
      confirmationCode: newConfirmationCode,
      subject: "resending confirmation code",
    };
    await emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return {
      status: ResultCode.Success,
      data: true,
    };
  }
}
