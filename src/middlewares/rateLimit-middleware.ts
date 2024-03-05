import { Request, Response, NextFunction} from "express"
import { validationResult, ValidationError } from "express-validator"
import { emailAdaper } from "../utils/emailAdaper";
import { rateLimitCollection } from "../BD/db";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) =>{
    const URL = req.baseUrl;
    const ip = req.headers?.['x-forwarded-for']?.[0] || req.ip || "unknown";
    const date = new Date();
    const requesterInfo = {ip: ip, URL: URL, date: date}

    await rateLimitCollection.insertOne(requesterInfo)
    const logger =await rateLimitCollection.find({URL:URL}).toArray()

    let nearestExpiryTime = 0

    if (logger?.length > 4){
        nearestExpiryTime = Math.ceil( (logger[0]?.date?.getTime() - logger[4]?.date?.getTime() )) / 1000 ; 
    }

    // console.log("------------------------logger------------------")
    // console.log(logger)

    // const nearestExpiryTime = logger.length > 3 ? Math.ceil( (Date.now() - logger[4]?.date?.getTime() )) / 1000 : 0;

    // console.log("------------------------nearestExpiryTime------------------")
    // console.log(nearestExpiryTime)

    // if (nearestExpiryTime && nearestExpiryTime <= 10){
    //     res.header("Retry-After", String(nearestExpiryTime)).status(429).send("rateLimitMiddleware")
    //     return
    // }

  



    // const emailInfo = {
    //     email: "7656077@Mail.ru",
    //     subject: "rateLimitMiddleware",
    //     confirmationCode: "zzzzzzz",
    //     debugger: logger
    //   };
    //   await emailAdaper.sendEmailDebug(emailInfo);


    // const userOptions = { }

    // Написать промежуточный слой (middleware), который будет считать количество документов 
    // по фильтру (IP, URL, date >= текущей даты - 10 сек).
    
    return next()

}