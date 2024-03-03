export type OutputUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  blackListToken: string[];
  emailConfirmation: emailConfirmationType;
};

type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

export type JWTDecodedType = {
  userId: string;
  deviceId: string;
  iat: string,
  exp: string
};

export type ResultType = {
  status: string;
  errorMessage?: string;
  data?: Boolean;
};
