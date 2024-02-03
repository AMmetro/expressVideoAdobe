import {WithId} from 'mongodb'
import { UserDB } from '../db/user-db'
import { OutputUserType } from '../output/user.output'

export const userMapper = (user:WithId<UserDB>):OutputUserType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}
