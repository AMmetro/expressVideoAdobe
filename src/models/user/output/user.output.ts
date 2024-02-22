export type OutputUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  emailConfirmation: emailConfirmationType;
};

type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

// export type OutputType = {
//   id: string;
//   content: string;
//   commentatorInfo: {
//     userId: string;
//     userLogin: string;
//   };
//   createdAt: string;
// };

export type ResultType = {
  status: string;
  errorMessage?: string;
  data?: Boolean;
};
