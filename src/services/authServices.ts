import { RequestInputUserType } from "../models/user/input/updateUser-input-model";
import { UserQueryRepository } from "../repositories/user.query-repository";
import { basicSortQuery } from "../utils/sortQeryUtils";
import { ResultCode } from "../validators/error-validators";
import { hashServise } from "../utils/JWTservise";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserRepository } from "../repositories/user-repository";

export class AuthServices {

  static async registrationUserWithConfirmation(
    registrationData: RequestInputUserType
  ): Promise<any | null> {
    const { login, password, email } = registrationData;

    // const basicSearchUserData = basicSortQuery({})
    // const searchUserData = {...basicSearchUserData,
    //                          searchEmailTerm: email,
    //                          searchLoginTerm: login,
    //                          }
    const userSearchData = {login:login, email:email}



    const userAllreadyExist = await UserQueryRepository.getOneForAuth(login)

    return userAllreadyExist;
    
    // const userExistRespons = await UserQueryRepository.getAll(searchUserData)

    // if (userExistRespons && userExistRespons?.items?.length > 0) {
    if (userAllreadyExist) {
      return {
        status: ResultCode.Conflict,
        errorMessage: "User allready exist",
        }
      }
      const passwordSalt = await hashServise.generateSalt()
      const passwordHash = await hashServise.generateHash(password, passwordSalt)
      const newUser = {
        login: login,
        email: email,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
          confirmationCode: randomUUID(),
          expirationDate: add(new Date(), {hours: 1, minutes: 30}),
          isConfirmed: false
        }
      }
      await UserRepository.createWithConfirmation(newUser)



    // console.log("userExist")
    // console.log(userExist)

    // const newUserModal: UserDB = {
    //   login: login,
    //   email: email,
    //   createdAt: new Date().toISOString(),
    // };

  //   const newUserId = await UserRepository.create(newUserModal);
  //   if (!newUserId) {
  //     return null;
  //   }
  //   const createdUser = await UserQueryRepository.getById(newUserId);
  //   if (!createdUser) {
  //     return null;
  //   }
    // return userExistRespons;
  }




}
