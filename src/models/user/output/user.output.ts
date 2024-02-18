export type OutputUserType = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
    emailConfirmation: emailConfirmationType;
}

  type emailConfirmationType = {
    confirmationCode: string;
    expirationDate: any;
    isConfirmed: boolean;
  };