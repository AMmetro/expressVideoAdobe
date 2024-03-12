import express, { Router, Request, Response } from "express";
import {
  BlogModel,
  RateLimitModel,
  // UserModel,
  // blogsCollection,
  CommentModel,
  PostModel,
  // rateLimitCollection,
  SecurityDevicesModel,
  UserModel,
  // LikesModel,
} from "../BD/db";

type ResponseType<P> = Response<P, Record<string, any>>;

export const testingRoute = Router({});

testingRoute.delete(
  "/all-data",
  async (req: Request, res: ResponseType<{}>) => {
    await RateLimitModel.deleteMany({});
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await SecurityDevicesModel.deleteMany({});
    await CommentModel.deleteMany({});
    // await LikesModel.deleteMany({});
    //    await drop.darabase() - если есть права админа (в докере по умолчанию в атласе назначить)
    res.sendStatus(204);
  }
);
