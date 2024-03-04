import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";
import { OutputPostType } from "../src/models/post/output/post.output";

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
      email: i + "email56010@gg.com",
    })
    .expect(201);
  return response.body;
};

export const loginUsers = async (app: any, i: number) => {
  const test = setTimeout(() => {}, 10);
  await test;

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
// -----------------------------------------------------------

describe("should return API data", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });

  it("- POST create USER", async function () {
    for (let i = 0; i < usersCount; i++) {
      const responseNewUser = await createUsers(app, i);
      users.push(responseNewUser);
      // console.log("========authUsers========")
      // console.log(responseNewUser)
    }
  });

  it("- Get all existing users", async () => {
    const authUsers = await request(app)
          .get("/users/")
          .auth("admin", "qwerty")
      // console.log("========authUsers========")
      // console.log(authUsers.body)
  });

  it("- Login 4 times first user", async () => {
    // make array with devices options for save data
    for (let i = 0; i < devicesCount; i++) {
      // devicesInfo[i] = users[0];
      devicesInfo[i] = {};
      devicesInfo[i].userId = users[0].id;
    }
    // login users and save data to array
    for (let i = 0; i < devicesCount; i++) {
      const responseNewDevices = await loginUsers(app, 0);
      const accessToken = await responseNewDevices.body.accessToken;

      devicesInfo[i] = await responseNewDevices.body; // временно !!!!

      devicesInfo[i].accessToken = accessToken;
      const cookies = responseNewDevices.headers["set-cookie"];
      devicesInfo[i].refreshToken = cookies[0].split("=")[1];
    }
    // console.log("========authUsers========")
    // console.log(devicesInfo)
  });

  it("- GET created devices", async () => {
    const authUsers = await request(app)
      .get("/security/devices/")
      .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
    usersDevices = authUsers.body;
    expect(authUsers.body).toEqual(expect.any(Array));
    // expect(authUsers.body.length).toEqual(8);
    // console.log("========usersDevices========")
    // console.log(usersDevices)
  });

  it("- POST REFRESF-TOKEN devices", async () => {
    const authUsers = await request(app)
      .post("/auth/refresh-token/")
      .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);

    // console.log("========1111111111111111111========")
    // console.log(devicesInfo[0].refreshToken)

    // usersDevices = authUsers.body
    expect(authUsers.status).toBe(200);
    const cookies = authUsers.headers["set-cookie"];
    devicesInfo[0].refreshToken = cookies[0].split("=")[1];
    expect(authUsers.body).toEqual(expect.any(Object));

    // console.log("========22222222222222========")
    // console.log(devicesInfo[0].refreshToken)
  });

  it("- DELETE one device with :deviceId", async () => {
    const del = await request(app)
      .delete("/security/devices/" + usersDevices[1].deviceId)
      .set("Cookie", `refreshToken=${devicesInfo[1].refreshToken}`);
    expect(del.status).toBe(204);
  });

  it("- DELETE device that is not exist", async () => {
    const del = await request(app)
      .delete("/security/devices/" + usersDevices[1].deviceId)
      .set("Cookie", `refreshToken=${devicesInfo[1].refreshToken}`);
    expect(del.status).toBe(404);
  });

  it("- DELETE  device with ERROR 404", async () => {
    const del = await request(app)
      .delete("/security/devices/" + 1234567890)
      .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
    expect(del.status).toBe(404);
  });

  it("- POST REFRESF-TOKEN devices", async () => {
    const authUsers = await request(app)
      .post("/auth/refresh-token/")
      .set("Cookie", `refreshToken=${devicesInfo[2].refreshToken}`);

    // console.log("========1111111111111111111========")
    // console.log(devicesInfo[0].refreshToken)

    // usersDevices = authUsers.body
    expect(authUsers.status).toBe(200);
    const cookies = authUsers.headers["set-cookie"];
    devicesInfo[2].refreshToken = cookies[0].split("=")[1];
    expect(authUsers.body).toEqual(expect.any(Object));

    // console.log("========22222222222222========")
    // console.log(devicesInfo[0].refreshToken)
  });

  it("- Login 1 times second user and delete foreign devices", async () => {
    const response = await request(app)
      .post("/auth/login")
      .auth("admin", "qwerty")
      .send({
        loginOrEmail: "login1",
        password: "password",
      })
      .expect(200);
    const cookies = response.headers["set-cookie"];
    const refreshToken = cookies[0].split("=")[1];
    const del = await request(app)
      .delete("/security/devices/" + usersDevices[0].deviceId)
      .set("Cookie", `refreshToken=${refreshToken}`);
    expect(del.status).toBe(403);
  });

  it("- DELETE  All other devices", async () => {
    const del = await request(app)
      .delete("/security/devices/")
      .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
    expect(del.status).toBe(204);
    // expect(del.body).toEqual(expect.any(Array));
  });

  it("- GET created devices", async () => {
    const authUsers = await request(app)
      .get("/security/devices/")
      .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
    usersDevices = authUsers.body;
    // expect(authUsers.body).toEqual(expect.any(String));
    expect(authUsers.body.length).toEqual(1);
    // console.log("========usersDevices========")
    // console.log(usersDevices)
  });

  it("- LOGOUT one other devices", async () => {
    const del = await request(app)
      .post("/auth/logout/")
      .set(
        "Cookie",
        `refreshToken=${devicesInfo[0].refreshToken}`
      );
    expect(del.status).toBe(204);
    // expect(del.body).toEqual(expect.any(Array));
  });

  it("- GET created devices", async () => {
    const authUsers = await request(app)
      .get("/security/devices/")
      .set("Cookie", `refreshToken=${devicesInfo[0].refreshToken}`);
    usersDevices = authUsers.body;
    expect(authUsers.body).toEqual(expect.any(String));
    // expect(authUsers.body.length).toEqual(1);
    // console.log("========usersDevices========")
    // console.log(usersDevices)
  });
























  // it("- GET created devices", async () => {
  //   const authUsers = await request(app)
  //     .get("/security/devices/")
  //     .set("Cookie", `refreshToken=${devicesInfo[devicesCount-1].refreshToken}`);
  //     usersDevices = authUsers.body
  //   expect(authUsers.body).toEqual(expect.any(Array));
  // // console.log("========usersDevices========")
  // // console.log(usersDevices)
  // });

  // it("- GET created user token", async () => {
  //   const {memorisedNewUserLogin} = expect.getState()
  //   const responseUsers = await request(app)
  //   .post("/auth/login")
  //   .send({
  //     loginOrEmail: memorisedNewUserLogin,
  //     password: user.password
  //     })
  //    .expect(200);

  //    expect.setState({ memorisedUserToken: responseUsers.body.accessToken })
  //    expect(responseUsers.body.accessToken).toEqual(expect.any(String));
  // });

  //   it("- POST create new BLOG for created User", async function () {
  //   const response = await request(app)
  //     .post("/blogs/")
  //     .auth("admin", "qwerty")
  //     // .set('Authorization', token)
  //     .send({
  //       name: "blog name",
  //       description: "description",
  //       websiteUrl: "https://www.someadess.com",
  //     })
  //     .expect(201)

  //     expect(response.body).toEqual({
  //       id: expect.any(String),
  //       isMembership: false,
  //       description: expect.any(String),
  //       name: expect.any(String),
  //       websiteUrl: expect.any(String),
  //       createdAt: expect.any(String),
  //     });

  //     expect.setState({ memorisedNewBlogId: response.body.id });

  // });

  //   it("- POST create new POST for created BLOG", async function () {
  //   const {memorisedNewBlogId} = expect.getState()
  //   const response = await request(app)
  //     .post("/posts/")
  //     .auth("admin", "qwerty")
  //     // .set('Authorization', token)
  //     .send({
  //       title: "title",
  //       shortDescription: "shortDescription",
  //       content: "content",
  //       blogId: memorisedNewBlogId,
  //     })
  //     .expect(201);

  //     expect(response.body).toEqual({
  //       blogId: expect.any(String),
  //       blogName: expect.any(String),
  //       content: expect.any(String),
  //       id: expect.any(String),
  //       shortDescription: expect.any(String),
  //       title: expect.any(String),
  //       createdAt: expect.any(String),
  //     });
  //     expect.setState({ memorisedNewPostId: response.body.id });
  //     expect.setState({ memorisedNewBlogId: response.body.blogId });
  // });

  //   it("- GET created POST", async function () {
  //   const {memorisedNewBlogId} = expect.getState()
  //   const {memorisedNewPostId} = expect.getState()
  //   const responseNewPost = await request(app)
  //     .get("/posts/" + memorisedNewPostId)
  //     .expect(200)

  //     expect(responseNewPost.body).toEqual({
  //       title: "title",
  //       shortDescription: "shortDescription",
  //       content: "content",
  //       blogId: `${memorisedNewBlogId}`,
  //       createdAt: expect.any(String),
  //       blogName: "blog name",
  //       id: expect.any(String),
  //     });
  //   });

  //   it("- POST create new COMMENT for created POST", async function () {
  //     const {memorisedNewPostId} = expect.getState()
  //     const {memorisedUserToken} = expect.getState()
  //     const response = await request(app)
  //       .post("/posts/" + memorisedNewPostId + "/comments/")
  //       .set('Authorization', `Bearer ${memorisedUserToken}`)
  //       .send({
  //         content: "comment content > 20 symbol",
  //       })
  //       .expect(201);
  //       expect(response.body).toEqual({
  //          commentatorInfo: {
  //              userId: expect.any(String),
  //              userLogin: expect.any(String),
  //              },
  //           content: expect.any(String),
  //           createdAt: expect.any(String),
  //           id: expect.any(String),
  //       });
  //       expect.setState({ memorisedNewCommentId: response.body.id });
  //   });

  //     it("- PUT update created COMMENT", async function () {
  //   const {memorisedNewCommentId} = expect.getState()
  //   const {memorisedUserToken} = expect.getState()
  //   const responseUpdatedPost = await request(app)
  //     .put("/comments/" + memorisedNewCommentId)
  //     .set('Authorization', `Bearer ${memorisedUserToken}`)
  //     .send({
  //       content: "updated content updated",
  //     })
  //     .expect(204);
  //   })

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    client.close();
    done();
  });
});
