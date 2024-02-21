import {NextFunction, Request, Response} from "express";

import { jwtServise } from "../utils/JWTservise";
import { UserQueryRepository } from "../repositories/user.query-repository";

export const jwtValidationMiddleware =async (req: Request, res: Response, next: NextFunction )=> {
    if (!req.headers.authorization){
        res.send(401)
        return 
     }
     const token = req.headers.authorization.split(" ")[1]

     const userId = await jwtServise.getUserIdByAcssToken(token)

   //   console.log("--------------userId---------------"); 
   //   console.log(userId); 
     
     

   //   req.user = userId //dell 
   //   next() //
   //   return //
     
     if (userId){
        const user = await UserQueryRepository.getById(userId)
                        // console.log("--------------user---------------"); 
                        // console.log(user); 
        if (!user){res.send(401)}
        req.user = user
        next()
        return
     }    
     res.send(401) 
}

