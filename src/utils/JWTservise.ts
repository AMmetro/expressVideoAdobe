import { ObjectId, SortDirection, WithId } from "mongodb";
import { UserDB } from "../models/user/db/user-db";
import jwt from "jsonwebtoken";
import { OutputUserType } from "../models/user/output/user.output";

const settings = { JWT_SECRET: process.env.JWT_SECRET || "123" };

export const jwtServise = {
  async createJWT(user: OutputUserType) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token
//     return {
//       resultCode: 0,
//       data: { token: token },
//     };
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = await jwt.verify(token, settings.JWT_SECRET)
      // return new ObjectId(result.userId)
      return result.userId
    }
    catch (e){
      return null
    }
  },

};
