import { Request, Response, NextFunction} from "express"
import { emailAdaper } from "../utils/emailAdaper";
import { rateLimitCollection } from "../BD/db";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) =>{
    const URL = req.originalUrl;
    const ip = req.ip || "unknown";
    const date = new Date();
    const requesterInfo = {ip: ip, URL: URL, date: date}

    await rateLimitCollection.insertOne(requesterInfo)

 

    const logger =await rateLimitCollection.countDocuments({URL:URL, ip: ip, date: {$gte:new Date(Date.now() - 10000)}})
    // const logger =await rateLimitCollection.find({URL:URL, ip: ip, date: {$gte:new Date(Date.now() - 10000)}}).toArray()

    // console.log("------------------------logger------------------")
    // console.log(logger)

    if (logger > 5) return 429

    //    let nearestExpiryTime = 0

    // if (logger?.length > 4){
    //     nearestExpiryTime = Math.ceil( (logger[0]?.date?.getTime() - logger[4]?.date?.getTime() )) / 1000 ; 
    // }

    // console.log("------------------------logger------------------")
    // console.log(logger)

    // const nearestExpiryTime = logger.length > 3 ? Math.ceil( (Date.now() - logger[4]?.date?.getTime() )) / 1000 : 0;

    // console.log("------------------------nearestExpiryTime------------------")
    // console.log(nearestExpiryTime)

    // if (nearestExpiryTime && nearestExpiryTime <= 10){
    //     res.header("Retry-After", String(nearestExpiryTime)).status(429).send("rateLimitMiddleware")
    //     return
    // }

  
    
    return next()

}