import { ObjectId, SortDirection, WithId } from "mongodb";
import { UserDB } from "../models/user/db/user-db";
import jwt from "jsonwebtoken";
import { OutputUserType } from "../models/user/output/user.output";
import { appConfig } from "../appConfig";
import bcrypt from "bcrypt";

export const jwtServise = {
  async createAccessTokenJWT(user: OutputUserType) {
    const token = jwt.sign({ userId: user.id }, appConfig.JWT_ACSS_SECRET, {
      expiresIn: "10h",
    });
    return token;
    //     return {
    //       resultCode: 0,
    //       data: { token: token },
    //     };
  },

  async createRefreshTokenJWT(user: OutputUserType) {
    const token: any = jwt.sign({ userId: user.id }, appConfig.JWT_REFRESH_SECRET, {
      expiresIn: "20h",
    });
    return token;
    //     return {
    //       resultCode: 0,
    //       data: { token: token },
    //     };
  },

  async getUserIdByAcssToken(token: string) {
    try {
      const result:any = jwt.verify(
        token,
        appConfig.JWT_ACSS_SECRET,
        // (err, decoded) => {
        //   if (err) {
        //     if (err.name === "TokenExpiredError") {
        //       console.log("Token expired");
        //       return "Token expired";
        //     } else {
        //       console.log("Token is broken");
        //       return "Token is broken";
        //     }
        //   } else {
        //     return decoded;
        //   }
        // }
      );
      return result.userId;
    } catch (e) {
      return null;
    }
  },

  async getUserIdByRefreshToken(token: string) {
    console.log("------token-IN-----")
    console.log(token)
    try {
      const result: any = await jwt.verify(token, appConfig.JWT_REFRESH_SECRET);

      console.log("------result-IN-----")
      console.log(result)

      return result.userId;
    } catch (e) {
      return null;
    }
  },
};

export const hashServise = {
  async generateSalt() {
    const salt = await bcrypt.genSalt(10);
    return salt;
  },

  async generateHash(password: string, paswordSalt: string) {
    const hash = await bcrypt.hash(password, paswordSalt);
    return hash;
  },
};
