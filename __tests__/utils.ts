import request from "supertest";
// import { app } from "../src/settings";
import {  } from "../src/models/post/output/post.output";

export const createUsers = async (app:any, i:number)=> {
  const response = await request(app)
  .post("/users/")
  .auth("admin", "qwerty")
  .send({
    login: "log" + i,
    password: "new_password",
    email: "email56010@gg.com",
    // email: "ema4353",
  })
  .expect(201);
  return response.body 
}