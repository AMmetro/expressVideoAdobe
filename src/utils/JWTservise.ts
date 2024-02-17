import { ObjectId, SortDirection, WithId } from "mongodb";
import { UserDB } from "../models/user/db/user-db";
import jwt from "jsonwebtoken";
import { OutputUserType } from "../models/user/output/user.output";
import { appConfig } from '../appConfig';
import bcrypt from "bcrypt";


export const jwtServise = {
  
  async createJWT(user: OutputUserType) {
    const token = jwt.sign({ userId: user.id }, appConfig.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token
//     return {
//       resultCode: 0,
//       data: { token: token },
//     };
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = await jwt.verify(token, appConfig.JWT_SECRET)
      // return new ObjectId(result.userId)
      return result.userId
    }
    catch (e){
      return null
    }
  },

};


export const hashServise = {
  
  async generateSalt() {
    const salt = await bcrypt.genSalt(10);
    return salt
  },

  async generateHash(password: string, paswordSalt: string) {
    const hash = await bcrypt.hash(password, paswordSalt);
    return hash;
  }

};

