import {WithId} from 'mongodb'
import { UserDB } from '../db/user-db'
import { OutputUserType } from '../output/user.output'

export const userMapper = (user:WithId<UserDB>):OutputUserType => {
    const emailConfirm= user.emailConfirmation
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        emailConfirmation: emailConfirm,
    }
}
