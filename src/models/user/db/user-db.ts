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

