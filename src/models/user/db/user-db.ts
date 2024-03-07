import { WithId } from 'mongodb';
import mongoose from 'mongoose'

export type UserDB = {
  login: string;
  passwordHash: string;
  passwordSalt: string;
  blackListToken: string[];
  email: string;
  createdAt: string;
  emailConfirmation: emailConfirmationType;
};

type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

export const UserSchema = new mongoose.Schema<WithId<UserDB>>({
  login:{ type: String, require: true },
  passwordHash: { type: String, require: true },
  passwordSalt: { type: String, require: true },
  email: { type: String, require: true },
  createdAt: { type: String, require: true },
  // emailConfirmation: { type: emailConfirmationType, require: true },
})

