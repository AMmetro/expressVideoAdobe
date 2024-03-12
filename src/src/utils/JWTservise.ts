import { ObjectId, SortDirection, WithId } from "mongodb";
import { UserDB } from "../models/user/db/user-db";
import jwt from "jsonwebtoken";
import { JWTDecodedType, OutputUserType } from "../models/user/output/user.output";
import { appConfig } from "../appConfig";
import bcrypt from "bcrypt";

export const jwtServise = {
  async createAccessTokenJWT(user: OutputUserType, deviceId:string) {
    const token = jwt.sign({ userId: user.id, deviceId }, appConfig.JWT_ACSS_SECRET, {
      expiresIn: "10s",
    });
    return token;
    //     return {
    //       resultCode: 0,
    //       data: { token: token },
    //     };
  },

  async createRefreshTokenJWT(user: OutputUserType,  deviceId:string) {
    const token: any = jwt.sign({ userId: user.id, deviceId }, appConfig.JWT_REFRESH_SECRET, {
      expiresIn: "20s",
    });
    return token;
  },


  async getUserFromAcssesToken(token: string):Promise<JWTDecodedType | null> {
    try {
      const jwtUserData:any = jwt.verify(
        token,
        appConfig.JWT_ACSS_SECRET,
        (err, decoded) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              console.log("Access Token expired");
              return "Access Token expired";
            } else {
              console.log("Access Token is broken");
              return "Access Token is broken";
            }
          } else {
            return decoded;
          }
        }
      );
      return jwtUserData;
    } catch (e) {
      return null;
    }
  },


  async getUserFromRefreshToken(token: string):Promise<JWTDecodedType | null> {
    try {
      const result:any = jwt.verify(
        token,
        appConfig.JWT_REFRESH_SECRET,
        (err, decoded) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              console.log("Token expired");
              return "Token expired";
            } else {
              console.log("Token is broken");
              return "Token is broken";
            }
          } else {
            return decoded;
          }
        }
      );
      // const outUser = {userId: result.userId, deviceId: result.deviceId}
      return result;
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
