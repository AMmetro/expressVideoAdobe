import { ObjectId } from "mongodb";
import { usersCollection } from "../BD/db";
import { UserDB } from "../models/user/db/user-db";

export class UserRepository {

  static async create(newUserData: UserDB) {
        const newUserId = await usersCollection.insertOne(newUserData);
       return newUserId.insertedId.toString()
  }
  static async createWithConfirmation(confirmationNewUserData: UserDB) {
        const newUserId = await usersCollection.insertOne(confirmationNewUserData);
       return newUserId.insertedId.toString()
  }

  static async delete(deleteUserId: string): Promise<Boolean> {
    const deletePost = await usersCollection.deleteOne({
      _id: new ObjectId(deleteUserId),
    });
    return !!deletePost.deletedCount;
  }
}
