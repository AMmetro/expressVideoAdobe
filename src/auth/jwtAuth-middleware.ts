import {NextFunction, Request, Response} from "express";

import { jwtServise } from "../utils/JWTservise";
import { UserServices } from "../services/userServices";
import { UserQueryRepository } from "../repositories/user.query-repository";

export const jwtValidationMiddleware =async (req: Request, res: Response, next: NextFunction )=> {
    if (!req.headers.authorization){
        res.send(401)
        return
     }
     const token = req.headers.authorization.split(" ")[1]
     const userId = await jwtServise.getUserIdByToken(token)
     if (userId){
        req.user = await UserQueryRepository.getById(userId)
        next()
        return
     }
     res.send(403) 
}

