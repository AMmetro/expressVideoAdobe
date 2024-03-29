import { Request, Response, NextFunction} from "express"
import {
     RateLimitModel,
    //  rateLimitCollection 
    } from "../BD/db";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) =>{
    const URL = req.originalUrl;
    const ip = req.ip || "unknown";
    const date = new Date();
    const requesterInfo = {ip: ip, URL: URL, date: date}

    // await rateLimitCollection.insertOne(requesterInfo)
    await RateLimitModel.create(requesterInfo)

    //  const logger =await rateLimitCollection.countDocuments({URL:URL, ip: ip, date: {$gte:new Date(Date.now() - 10000)}})
     const logger =await RateLimitModel.countDocuments({URL:URL, ip: ip, date: {$gte:new Date(Date.now() - 10000)}})
    if (logger > 5) return res.sendStatus(429);   
    return next()
}