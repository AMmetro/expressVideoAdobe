import express, { Router, Request, Response } from "express";
import {
  BlogModel,
  RateLimitModel,
  // UserModel,
  // blogsCollection,
  CommentModel,
  PostModel,
  // rateLimitCollection,
  securityDevicesCollection,
  UserModel,
} from "../BD/db";

type ResponseType<P> = Response<P, Record<string, any>>;

export const testingRoute = Router({});

testingRoute.delete(
  "/all-data",
  async (req: Request, res: ResponseType<{}>) => {
    await RateLimitModel.deleteMany({});
    
    // await blogsCollection.deleteMany({});
    await BlogModel.deleteMany({});

    // await postsCollection.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await securityDevicesCollection.deleteMany({});
    await CommentModel.deleteMany({});
    // await rateLimitCollection.deleteMany({});
    //    await drop.darabase() - если есть права админа (в докере по умолчанию в атласе назначить)
    res.sendStatus(204);
  }
);
