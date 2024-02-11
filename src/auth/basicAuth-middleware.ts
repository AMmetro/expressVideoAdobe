import { Request, Response, NextFunction} from "express"

import { appConfig } from '../appConfig';
const AcsessLogin = appConfig.LOGIN
const AcsessPass = appConfig.PASS

console.log("AcsessLogin")
console.log(AcsessLogin)
console.log("AcsessPass")
console.log(AcsessPass) 
 
// const AcsessLogin = "admin"
// const AcsessPass = "qwerty"

export const authMiddleware = (req: Request, res: Response, next: NextFunction):void => {
   
const auth =  req.headers['authorization']
if (!auth){
res.sendStatus(401)
return
}

const [basic, token] = auth.split(" ")
if (basic !== "Basic"){
    res.sendStatus(401)
    return
    }

 const decodedToken = Buffer.from(token, "base64").toString()
 const [login, password] = decodedToken.split(":")

  if (login !== `${AcsessLogin}` || password !== `${AcsessPass}`){
    res.sendStatus(401)
    return
    }
    return next()

}


