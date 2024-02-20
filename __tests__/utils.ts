import request from "supertest";

// export const createUsers = async (app:any, i:number)=> {
//   const response = await request(app)
//   .post("/users/")
//   .auth("admin", "qwerty")
//   .send({
//     login: "seR" + i,
//     password: "password" + i,
//     email: i + "email56010@gg.com",
//   })
//   .expect(201);
//   return response.body 
// }