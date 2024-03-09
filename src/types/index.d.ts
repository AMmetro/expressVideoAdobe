import {OutputUserType} from "../models/user/output/user.output";

type UserExtendedType = OutputUserType & {id: string} & {deviceId: string} & {iat: number}

declare global {
    declare namespace Express {
        export interface Request {
            user: UserExtendedType | null
        }
    }
}