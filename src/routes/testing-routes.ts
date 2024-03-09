import express, {Router, Request, Response} from 'express';
import { authMiddleware } from "../auth/auth-middleware"
import { postValidation } from "../validators/post-validators"
import { PostRepository } from "../repositories/post-repository"
import { KittenModel, blogsCollection, postsCollection } from '../BD/db';
import { promises } from 'dns';

type ResponseType<P> = Response <P, Record<string, any> >

export const testingRoute = Router({})

testingRoute.delete('/all-data', async(req: Request, res: ResponseType<{}>) => {
//    await KittenModel.deleteMany({});
//    await blogsCollection.deleteMany({});
//    await postsCollection.deleteMany({});  
//    await drop.darabase() - если есть права админа (в докере по умолчанию в атласе назначить)
    res.sendStatus(204);
})
