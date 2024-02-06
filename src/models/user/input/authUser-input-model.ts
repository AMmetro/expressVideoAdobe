export type AuthUserInputModel = {
    password: string,
    loginOrEmail: string,
}

export type AuthUserFindModel = {
    loginOrEmail: string,
    password: string,
}
