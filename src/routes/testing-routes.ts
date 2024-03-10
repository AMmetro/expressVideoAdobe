import express, { Router, Request, Response } from "express";
import {
  BlogModel,
  RateLimitModel,
  // UserModel,
  // blogsCollection,
  commentsCollection,
  postsCollection,
  // rateLimitCollection,
  securityDevicesCollection,
  usersCollection,
} from "../BD/db";

type ResponseType<P> = Response<P, Record<string, any>>;

export const testingRoute = Router({});

testingRoute.delete(
  "/all-data",
  async (req: Request, res: ResponseType<{}>) => {
    // await UserModel.deleteMany({});
    await RateLimitModel.deleteMany({});
    
    // await blogsCollection.deleteMany({});
    await BlogModel.deleteMany({});

    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await securityDevicesCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    // await rateLimitCollection.deleteMany({});
    //    await drop.darabase() - если есть права админа (в докере по умолчанию в атласе назначить)
    res.sendStatus(204);
  }
);
