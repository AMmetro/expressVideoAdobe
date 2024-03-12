import request from 'supertest' 
import mongoose from 'mongoose'
import { app } from "../src/settings";

describe('Mongoose integration', () => {
    const mongoURI = "mongodb+srv://metroexpress:suradet842@cluster0.gkpqpve.mongodb.net"+"/BlogDB"
    
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('clear all data', () => {
        it('+ GET blogs', async () => {
            await request(app).delete("/testing/all-data").expect(204);
        })
    })

    // describe('GET blogs', () => {
    //     it('+ GET blogs', async () => {
    //         const res_ = await request(app)
    //             .get('/blogs')
    //             .expect(200)
    //         expect(res_.body.items.length).toBe(10)
    //     })
    // })


})

// import request from "supertest";
// import { app } from "../src/settings";
// import { client } from "../src/BD/db";
// import mongoose from 'mongoose'

// // --------------------------------------------------------------------
// const devicesCount = 7;
// const usersCount = 2;
// const users: any = [];
// let devicesInfo: any = [];
// let usersDevices: any = [];
// export const createUsers = async (app: any, i: number) => {
//   const response = await request(app)
//     .post("/users/")
//     .auth("admin", "qwerty")
//     .set("User-Agent", "agent" + i)
//     .send({
//       login: "login" + i,
//       password: "password",
//       email: `${i}aoF48em67rt89@mail.com`,
//     })
//     .expect(201);
//   return response.body;
// };

// export const loginUsers = async (app: any, i: number) => {
//   const response = await request(app)
//     .post("/auth/login")
//     .auth("admin", "qwerty")
//     .send({
//       loginOrEmail: users[i].login,
//       password: "password",
//     })
//     .expect(200);
//   return response;
// };


// const delay = (milliseconds: number): Promise<void> => {
//   return new Promise((resolve, reject) => {
//       setTimeout(() => {
//           resolve()
//       }, milliseconds)
//   })
// }
// // -----------------------------------------------------------

// describe("should return API data", () => {
//   beforeAll(async () => {
//     // await mongoose.connect(mongoURI)

//     await request(app).delete("/testing/all-data").expect(204);
//   });

//     it("- POST create USER", async function () {
//     for (let i = 0; i < usersCount; i++) {
//       const responseNewUser = await createUsers(app, i);
//       users.push(responseNewUser);
//     }
//   });


//   // it("- request for password recovery with broken email type ", async () => {
//   //   const response = await request(app)
//   //     .post("/auth/password-recovery/")
//   //     .auth("admin", "qwerty")
//   //     .send({
//   //       email: "broken-email-type",
//   //     })
//   //     .expect(400);
//   // });

//   // it("- request for password recovery with not existing email ", async () => {
//   //   const response = await request(app)
//   //     .post("/auth/password-recovery/")
//   //     .auth("admin", "qwerty")
//   //     .send({
//   //       email: "hello@mail.ru",
//   //     })
//   //     .expect(204);
//   //     // expect(response.body).toEqual(expect.any(Array));
//   // });

//   //  КАК ПРОВЕРИТЬ ПОЛУЧЕНИЕ ОТВЕТА НА ПОЧТУ С КОДОМ ???
//   // it("- request for password recovery with correcrt email ", async () => {
//   //   const response = await request(app)
//   //     .post("/auth/password-recovery/")
//   //     .auth("admin", "qwerty")
//   //     .send({
//   //       email: users[0].email,
//   //     })
//   //     // .expect(204);
//   //     // ----------------
//   //     .expect(200);
//   //     const recoveryCode  = response.body.code
//   //     expect.setState({ recoveryCode: recoveryCode });
//   //     // ------------
//   //     expect(recoveryCode).toEqual(expect.any(String));
//   // });

//     // it("- get new password with correcrt recoveryCode ", async () => {
//   //   const {recoveryCode} = expect.getState()
//   //   const response = await request(app)
//   //     .post("/auth/new-password/")
//   //     .auth("admin", "qwerty")
//   //     .send({
//   //       recoveryCode: recoveryCode,
//   //       newPassword: "password",
//   //     })
//   //     // .expect(204);
//   //     // ----------------
//   //     .expect(204);
//   //     // const recoveryCode  = response.body.code
//   //     // expect.setState({ recoveryCode: recoveryCode });
//   //     // ------------
//   //     // expect(recoveryCode).toEqual(expect.any(Array));
//   // });


//   // it("- new-password recovery with wrong recoveryCode ", async () => {
//   //   const response = await request(app)
//   //     .post("/auth/new-password/")
//   //     .auth("admin", "qwerty")
//   //     .send({
//   //       recoveryCode: "1234567890",
//   //       newPassword: "password",
//   //     })
//   //     .expect(400);
//   //     // expect(response.body).toEqual(expect.any(Array));
//   // });


//   // it("- get error with wrong recoveryCode ", async () => {
//   //   const {recoveryCode} = expect.getState()
//   //   const response = await request(app)
//   //     .post("/auth/new-password/")
//   //     .auth("admin", "qwerty")
//   //     .send({
//   //       recoveryCode: recoveryCode,
//   //       newPassword: "password",
//   //     })
//   //     .expect(400);
//   // });


//   afterAll((done) => {
//     // Closing the DB connection allows Jest to exit successfully.
//     client.close();
//     done();
//   });
// });