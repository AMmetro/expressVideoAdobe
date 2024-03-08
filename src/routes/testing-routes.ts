import express, { Router, Request, Response } from "express";
import {
  KittenModel,
  // BlogModel,
  commentsCollection,
  postsCollection,
  rateLimitCollection,
  // SecurityDevicesModel,
  usersCollection,
} from "../BD/db";

type ResponseType<P> = Response<P, Record<string, any>>;

export const testingRoute = Router({});

testingRoute.delete(
  "/all-data",
  async (req: Request, res: ResponseType<{}>) => {
    // await BlogModel.deleteMany({});
    // await KittenModel.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    // await SecurityDevicesModel.deleteMany({});
    await commentsCollection.deleteMany({});
    await rateLimitCollection.deleteMany({});
    //    await drop.darabase() - если есть права админа (в докере по умолчанию в атласе назначить)
    res.sendStatus(204);
  }
);
