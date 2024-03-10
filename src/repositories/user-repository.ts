import { ObjectId } from "mongodb";
import { UserModel } from "../BD/db";
import { UserDB } from "../models/user/db/user-db";

export class UserRepository {
  static async createWithOutConfirmation(newUserData: UserDB) {
    const newUserId = await UserModel.create(newUserData);
    return newUserId._id.toString();
  }


  static async updatePassword(userEmail: string, newPswrdHash: string) {
    const passwordUpdated = await UserModel.updateOne(
      {email: userEmail}, { $set: { "passwordHash": newPswrdHash } });
    return passwordUpdated.modifiedCount === 1;
  }

  static async createWithConfirmation(confirmationNewUserData: UserDB) {
    const newUserId = await UserModel.create(confirmationNewUserData);
    return newUserId._id.toString();
  }

  static async delete(deleteUserId: string): Promise<Boolean> {
    const deletePost = await UserModel.deleteOne({
      _id: new ObjectId(deleteUserId),
    });
    return !!deletePost.deletedCount;
  }

  static async confirmRegistration(userId: string): Promise<boolean> {
    const user = await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return user.modifiedCount === 1;
  }

  static async updateConfirmationCode(
    userId: ObjectId,
    newConfirmationCode: string
  ): Promise<boolean> {
    const user = await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { "emailConfirmation.confirmationCode": newConfirmationCode } }
    );
    return user.modifiedCount === 1;
  }

  static async addTokenToBlackListById(
    refreshToken: string,
    userId: string
  ): Promise<boolean> {
    const user = await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      {$push: {blackListToken: refreshToken}}
      )
    return user.modifiedCount === 1;
  }

  static async updatePswdRecoveryConfirmationCode(
    userId: ObjectId,
    newRecoveryCode: string
  ): Promise<boolean> {
    const user = await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { passwordRecoveryConfirmationCode: newRecoveryCode } }
    );
    return user.modifiedCount === 1;
  }


}
