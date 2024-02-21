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
import { usersCollection } from "../BD/db";

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

    // ------------------------------------------------------
    const newUserPrint = await usersCollection.findOne(new ObjectId(newUserId));
    console.log("newUserPrint")
    console.log(newUserPrint)

    // -----------------------------------------------------------------------------

    // const findedUsers = await usersCollection.findOne({ "emailConfirmation.confirmationCode": code });
    // const findedUsers = await usersCollection.find().toArray();
    // const emailInfoDebug = {
    //   email: "7656077@mail.ru",
    //   subject: "debug created user",
    //   confirmationCode: newUser.emailConfirmation!.confirmationCode,
    //   debug: JSON.stringify(findedUsers),
    // };
    // await emailAdaper.sendEmailRecoveryMessage(emailInfoDebug);
    // -----------------------------------------------------------------------------

       const emailInfo = {
      email: newUser.email,
      subject: "confirm Email",
      confirmationCode: newUser.emailConfirmation.confirmationCode,
      // debug: JSON.stringify(findedUsers),
    };
    await emailAdaper.sendEmailRecoveryMessage(emailInfo);

    return {
      status: ResultCode.Success,
      data: true,
    };
  }


  static async confirmEmail(code: string): Promise<any> {
    const userForConfirmation = await UserQueryRepository.getByConfirmationCode(code);

    // -----------------------------------------------------------------------------

    // const findedUsers = await usersCollection.findOne({ "emailConfirmation.confirmationCode": code });
    // const findedUsers = await usersCollection.find();
    // const emailInfo = {
    //   email: "7656077@mail.ru",
    //   message: "debug",
    //   subject: "debug confirmEmail",
    //   confirmationCode: code,
    //   debug: JSON.stringify(findedUsers),
    // };
    // await emailAdaper.sendEmailRecoveryMessage(emailInfo);
    // -----------------------------------------------------------------------------

    // console.log("--userForConfirmation----")
    // console.log(userForConfirmation)

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
          // `This confirmation code ${code} already been applied`,
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

                                                    //  ---------------------------------------------------------
                                                    const emailDebug1 = {
                                                      email: "7656077@mail.ru",
                                                      confirmationCode: "11111111111111111",
                                                      subject: "11111111111111resending confirmation code",
                                                      debug: "debug",
                                                    };
                                                    emailAdaper.sendEmailDebug(emailDebug1);
                                                    //  --------------------------------------------------------

    
    const emailIsConfirmed =
      userForEmailResending.emailConfirmation?.isConfirmed;

                                                    //  ---------------------------------------------------------
                                                    const emailDebug2 = {
                                                      email: "7656077@mail.ru",
                                                      confirmationCode: "22222222222222",
                                                      subject: "2222222222222resending confirmation code",
                                                      debug: "debug",
                                                    };
                                                    emailAdaper.sendEmailDebug(emailDebug2);
                                                    //  --------------------------------------------------------

    if (emailIsConfirmed) {
      return {
        status: ResultCode.ClientError,
        errorMessage: "Email is confirmed already",
      };
    }
    const newConfirmationCode = randomUUID();
                                                  //  ---------------------------------------------------------
                                                  const emailDebug3 = {
                                                    email: "7656077@mail.ru",
                                                    confirmationCode: userForEmailResending._id,
                                                    subject: "3333333333333resending confirmation code",
                                                    debug: userForEmailResending._id,
                                                  };
                                                  // @ts-ignore
                                                  emailAdaper.sendEmailDebug(emailDebug3);
                                                  //  --------------------------------------------------------
                                                  // userForEmailResending._id = 65d5bf2caca141f7311c2eee
    const codeUpd  = await UserRepository.updateConfirmationCode(userForEmailResending._id, newConfirmationCode)
                                                  //  ---------------------------------------------------------
                                                  const emailDebug4 = {
                                                    email: "7656077@mail.ru",
                                                    confirmationCode: "4444444444",
                                                    subject: "4444444444resending confirmation code",
                                                    debug: userForEmailResending._id,
                                                  };
                                                  emailAdaper.sendEmailDebug(emailDebug4);
                                                  //  --------------------------------------------------------
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

    //  ---------------------------------------------------------
    const emailDebug5 = {
      email: "7656077@mail.ru",
      confirmationCode: newConfirmationCode,
      subject: "5555555555resending confirmation code",
      debug: "debug",
    };
     emailAdaper.sendEmailDebug(emailDebug5);
    //  --------------------------------------------------------
    return {
      status: ResultCode.Success,
      data: true,
    };
  }
}
