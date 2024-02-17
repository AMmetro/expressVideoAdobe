export type UserDB = {
  login: string;
  passwordHash: string;
  passwordSalt: string;
  email: string;
  createdAt: string;
  emailConfirmation?: emailConfirmationType;
};

type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

// export type createWithConfirmationType = {
//   login: string;
//   email: string;
//   passwordHash: string;
//   createdAd: string;
//   emailConfirmation: {
//     confirmationCode: string;
//     expirationDate: any;
//     isConfirmed: boolean;
//   };
// };
