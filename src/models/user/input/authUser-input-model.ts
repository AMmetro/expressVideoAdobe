export type AuthUserInputModel = {
    login?: string,
    email?: string,
    password: string,
}

export type AuthUserFindModel = {
    loginOrEmail: string,
    password: string,
}
