import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";

// --------------------------------------------------------------------
const devicesCount = 7;
const usersCount = 2;
const users: any = [];
let devicesInfo: any = [];
let usersDevices: any = [];
export const createUsers = async (app: any, i: number) => {
  const response = await request(app)
    .post("/users/")
    .auth("admin", "qwerty")
    .set("User-Agent", "agent" + i)
    .send({
      login: "login" + i,
      password: "password",
      email: `${i}www48em67rt89@mail.com`,
    })
    .expect(201);
  return response.body;
};

export const loginUsers = async (app: any, i: number) => {
  const response = await request(app)
    .post("/auth/login")
    .auth("admin", "qwerty")
    .send({
      loginOrEmail: users[i].login,
      password: "password",
    })
    .expect(200);
  return response;
};


const delay = (milliseconds: number): Promise<void> => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve()
      }, milliseconds)
  })
}
// -----------------------------------------------------------

describe("should return API data", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });


  it("- new-password recovery with wrong recoveryCode ", async () => {
    const response = await request(app)
      .post("/auth/new-password/")
      .auth("admin", "qwerty")
      .send({
        recoveryCode: "1234567890",
        newPassword: "password",
      })
      .expect(400);
      // expect(response.body).toEqual(expect.any(Array));
  });


    it("- POST create USER", async function () {
    for (let i = 0; i < usersCount; i++) {
      const responseNewUser = await createUsers(app, i);
      users.push(responseNewUser);
    }
    console.log("users")
    console.log(users)
  });


  it("- request for password recovery with broken email type ", async () => {
    const response = await request(app)
      .post("/auth/password-recovery/")
      .auth("admin", "qwerty")
      .send({
        email: "broken-email-type",
      })
      .expect(400);
      // expect(response.body).toEqual(expect.any(Array));
  });

  it("- request for password recovery with not existing email ", async () => {
    const response = await request(app)
      .post("/auth/password-recovery/")
      .auth("admin", "qwerty")
      .send({
        email: "hello@mail.ru",
      })
      .expect(204);
      // expect(response.body).toEqual(expect.any(Array));
  });

  it("- request for password recovery with correcrt email ", async () => {
    const response = await request(app)
      .post("/auth/password-recovery/")
      .auth("admin", "qwerty")
      .send({
        email: "hello@mail.ru",
      })
      .expect(204);
      // expect(response.body).toEqual(expect.any(Array));
  });





  // it("- POST create USER", async function () {
  //   for (let i = 0; i < usersCount; i++) {
  //     const responseNewUser = await createUsers(app, i);
  //     users.push(responseNewUser);
  //   }
  // });

  // it("- Get all existing users", async () => {
  //   const authUsers = await request(app)
  //         .get("/users/")
  //         .auth("admin", "qwerty")
  // });

  // it("- Login 4 times first user", async () => {
  //   // make array with devices options for save data
  //   for (let i = 0; i < devicesCount; i++) {
  //     devicesInfo[i] = {};
  //     devicesInfo[i].userId = users[0].id;
  //   }
  //   // login users and save data to array
  //   for (let i = 0; i < devicesCount; i++) {
  //     await delay(2000);
  //     const responseNewDevices = await loginUsers(app, 0);
  //     const accessToken = await responseNewDevices.body.accessToken;

  //     devicesInfo[i] = await responseNewDevices.body;

  //     devicesInfo[i].accessToken = accessToken;
  //     const cookies = responseNewDevices.headers["set-cookie"];
  //     devicesInfo[i].refreshToken = cookies[0].split("=")[1];
  //   }
  // });

  // it("- GET created devices", async () => {
  //   const authUsers = await request(app)
  //     .get("/security/devices/")
  //     .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
  //   usersDevices = authUsers.body;
  //   expect(authUsers.body).toEqual(expect.any(Array));
  // });

  // it("- POST REFRESF-TOKEN devices", async () => {
  //   const authUsers = await request(app)
  //     .post("/auth/refresh-token/")
  //     .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);

  //   expect(authUsers.status).toBe(200);
  //   const cookies = authUsers.headers["set-cookie"];
  //   devicesInfo[0].refreshToken = cookies[0].split("=")[1];
  //   expect(authUsers.body).toEqual(expect.any(Object));
  // });

  // it("- DELETE one device with :deviceId", async () => {
  //   const del = await request(app)
  //     .delete("/security/devices/" + usersDevices[1].deviceId)
  //     .set("Cookie", `refreshToken=${devicesInfo[1].refreshToken}`);
  //   expect(del.status).toBe(204);
  // });

  // it("- DELETE device that is not exist", async () => {
  //   const del = await request(app)
  //     .delete("/security/devices/" + usersDevices[1].deviceId)
  //     .set("Cookie", `refreshToken=${devicesInfo[1].refreshToken}`);
  //   expect(del.status).toBe(401);
  // });

  // it("- DELETE  device with ERROR 404", async () => {
  //   const del = await request(app)
  //     .delete("/security/devices/" + 1234567890)
  //     .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
  //   expect(del.status).toBe(404);
  // });

  // it("- POST REFRESF-TOKEN devices", async () => {
  //   const authUsers = await request(app)
  //     .post("/auth/refresh-token/")
  //     .set("Cookie", `refreshToken=${devicesInfo[2].refreshToken}`);

  //   expect(authUsers.status).toBe(200);
  //   const cookies = authUsers.headers["set-cookie"];
  //   devicesInfo[2].refreshToken = cookies[0].split("=")[1];
  //   expect(authUsers.body).toEqual(expect.any(Object));
  // });

  // it("- Login 1 times second user and delete foreign devices", async () => {
  //   const response = await request(app)
  //     .post("/auth/login")
  //     .auth("admin", "qwerty")
  //     .send({
  //       loginOrEmail: "login1",
  //       password: "password",
  //     })
  //     .expect(200);
  //   const cookies = response.headers["set-cookie"];
  //   const refreshToken = cookies[0].split("=")[1];
  //   const del = await request(app)
  //     .delete("/security/devices/" + usersDevices[0].deviceId)
  //     .set("Cookie", `refreshToken=${refreshToken}`);
  //   expect(del.status).toBe(403);
  // });

  // it("- DELETE  All other devices", async () => {
  //   const del = await request(app)
  //     .delete("/security/devices/")
  //     .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
  //   expect(del.status).toBe(204);
  // });

  // it("- GET created devices", async () => {
  //   const authUsers = await request(app)
  //     .get("/security/devices/")
  //     .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
  //   usersDevices = authUsers.body;
  //   expect(authUsers.body.length).toEqual(1);
  // });

  // it("- LOGOUT one other devices", async () => {
  //   const del = await request(app)
  //     .post("/auth/logout/")
  //     .set(
  //       "Cookie",
  //       `refreshToken=${devicesInfo[0].refreshToken}`
  //     );
  //   expect(del.status).toBe(204);
  // });

  // it("- GET created devices", async () => {
  //   const authUsers = await request(app)
  //     .get("/security/devices/")
  //     .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
  //   usersDevices = authUsers.body;
  //   expect(authUsers.body).toEqual(expect.any(Object));
  // });



  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    client.close();
    done();
  });
});