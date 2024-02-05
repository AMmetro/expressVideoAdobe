export type UserDB = {
    login: string,
    passwordHash: string,
    passwordSalt: string,
    email: string,
    createdAt: string,
}

export type UserModel = {
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string,
}
