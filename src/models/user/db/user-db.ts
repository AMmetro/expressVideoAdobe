import mongoose, { ObjectId } from 'mongoose'
import { WithId } from 'mongodb'

export type blackListTokenType = string[]

// export type UserDB = {
//   login: string;
//   passwordHash: string;
//   passwordSalt: string;
//   blackListToken: blackListTokenType;
//   email: string;
//   createdAt: string;
//   emailConfirmation: emailConfirmationType;
// };

export class UserDB {
  constructor (
    // public _id: ObjectId, 
    public login: string,
    public passwordHash: string,
    public passwordSalt: string,
    // public blackListToken: blackListTokenType,
    public email: string,
    public createdAt: string,
    public emailConfirmation: emailConfirmationType,
  ) {}
};

type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

// export const BlackListTokenSchema = new mongoose.Schema<blackListTokenType>() // wrong!!

export const EmailConfirmationsChema = new mongoose.Schema<emailConfirmationType>({
  confirmationCode: { type: String, require: true },
  expirationDate: { type: String, require: true },
  isConfirmed: { type: Boolean, require: true },
})

export const UserSchema = new mongoose.Schema<WithId<UserDB>>({
  login: { type: String, require: true },
  passwordHash: { type: String, require: true },
  passwordSalt: { type: String, require: true },
  // blackListToken: { type: [String], require: true },
  email: { type: String, require: true },
  createdAt: { type: String, require: true },
  emailConfirmation: { type: EmailConfirmationsChema, require: true },
})






