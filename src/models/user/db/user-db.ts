import mongoose from 'mongoose'
import { WithId } from 'mongodb'


export type blackListTokenType = string[]

export type UserDB = {
  login: string;
  passwordHash: string;
  passwordSalt: string;
  blackListToken: blackListTokenType;
  email: string;
  createdAt: string;
  emailConfirmation: emailConfirmationType;
};

type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

export const BlackListTokenSchema = new mongoose.Schema<blackListTokenType>()

export const EmailConfirmationsChema = new mongoose.Schema<emailConfirmationType>({
  confirmationCode: { type: String, require: true },
  expirationDate: { type: String, require: true },
  isConfirmed: { type: Boolean, require: true },
})

export const UserSchema = new mongoose.Schema<UserDB>({
  login: { type: String, require: true },
  passwordHash: { type: String, require: true },
  passwordSalt: { type: String, require: true },
  // blackListToken: { type: BlackListTokenSchema, require: true },
  email: { type: String, require: true },
  createdAt: { type: String, require: true },
  emailConfirmation: { type: EmailConfirmationsChema, require: true },
})






