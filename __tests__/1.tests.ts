import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";
import { createUsers } from "./utils";
import { OutputPostType } from "../src/models/post/output/post.output";

describe("should return API data", () => {


  const user = {
    login: "newLogin",
    password: "new_password"
  }

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });

  it("- GET all users", async () => {
    await request(app).get("/users").expect(200);
  });

  it("- POST create 1 USER", async function () {
    const responseNewUser = await request(app)
      .post("/users/")
      .auth("admin", "qwerty")
      .send({
        login: user.login,
        password: user.password,
        email: "email56010@gg.com",
        // email: "ema4353",
      })
      .expect(201);

    expect.setState({ memorisedNewUserLogin: responseNewUser.body.login });

    expect(responseNewUser.body).toEqual({
      id: expect.any(String),
      login: user.login,
      email: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("- GET created users by login", async () => {
    const {memorisedNewUserLogin} = expect.getState()
    const responseUsers = await request(app).get(
      "/users/?searchLoginTerm=" + memorisedNewUserLogin
    );
    expect(responseUsers.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: expect.any(Array<OutputPostType>),
    });
  });


  it("- GET created user token", async () => {
    const {memorisedNewUserLogin} = expect.getState()
    const responseUsers = await request(app)
    .post("/auth/login")
    .send({
      loginOrEmail: memorisedNewUserLogin,
      password: user.password
      })
     .expect(200);

     expect.setState({ memorisedUserToken: responseUsers.text })
     expect(responseUsers.body.accessToken).toEqual(expect.any(String));
  });

    it("- AUTH user with token", async () => {
      const {memorisedUserToken} = expect.getState()
    const authUsers = await request(app)
    .get("/auth/me")
    .set('Authorization', `Bearer ${memorisedUserToken}`)
     expect(authUsers.body).toEqual({
      id: expect.any(String),
      login: user.login,
      email: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  // it("- GET users after request with query", async () => {
  //   const responseUsers = await request(app)
  //   .get("/users/?pageSize=15&pageNumber=1&searchLoginTerm=seR&searchEmailTerm=.com&sortDirection=asc&sortBy=login")
  //    expect(responseUsers.body).toEqual({
  //       pagesCount: 1,
  //       page: 1,
  //       pageSize: 15,
  //       totalCount: 11,
  //       items: expect.any(Array<OutputPostType>)
  //   });
  // });

  // it("- DELETE user with wrong auth", async () => {
  //   // const {memorisedNewBlogId} = expect.getState()
  //   const responseUser = await request(app)
  //   .get("/users/")
  //   const firstUserId = responseUser.body.items[0].id

  //   const deleteUser = await request(app)
  //   .delete("/users/" + firstUserId)
  //   .auth("admin", "qwerty")
  //   .expect(204);

  //   // console.log("--------URL-------------")
  //   // console.log(deleteUser.request.url)

  // });

  // it("- POST new POST with blog Id", async function () {
  //   const {memorisedNewBlogId} = expect.getState()
  //   const response = await request(app)
  //     .post("/posts/")
  //     .auth("admin", "qwerty")
  //     // .set('Authorization', token)
  //     .send({
  //       title: "post title",
  //       shortDescription: "post shortDescription",
  //       content: "content of post",
  //       blogId: `${memorisedNewBlogId}`
  //     })
  //     .expect(201);

  //     expect.setState({memorisedNewPostId:response.body.id})
  // });

  // it("- GET created POST", async function () {
  //   const {memorisedNewBlogId} = expect.getState()
  //   const {memorisedNewPostId} = expect.getState()
  //   const responseNewPost = await request(app)
  //     .get("/posts/" + memorisedNewPostId)
  //     .expect(200)

  //     expect(responseNewPost.body).toEqual({
  //       title: "post title",
  //       shortDescription: "post shortDescription",
  //       content: "content of post",
  //       blogId: `${memorisedNewBlogId}`,
  //       createdAt: expect.any(String),
  //       blogName: "blog name",
  //       id: expect.any(String),
  //     });
  //   });

  // it("- PUT update created POST", async function () {
  //   const {memorisedNewBlogId} = expect.getState()
  //   const {memorisedNewPostId} = expect.getState()
  //   const responseUpdatedPost = await request(app)
  //     .put("/posts/" + memorisedNewPostId)
  //     .auth("admin", "qwerty")
  //     .send({
  //       title: "updated title",
  //       shortDescription: "updated shortDescription",
  //       content: "updated of post",
  //       blogId: `${memorisedNewBlogId}`
  //     })
  //     .expect(204);
  //   })

  //   it("- GET updated POST and CHECK", async function () {
  //     const {memorisedNewBlogId} = expect.getState()
  //     const {memorisedNewPostId} = expect.getState()
  //     const responseNewPost = await request(app)
  //       .get("/posts/" + memorisedNewPostId)
  //       expect(responseNewPost.body).toEqual({
  //         title: "updated title",
  //         shortDescription: "updated shortDescription",
  //         content: "updated of post",
  //         blogId: `${memorisedNewBlogId}`,
  //         createdAt: expect.any(String),
  //         blogName: "blog name",
  //         id: expect.any(String),
  //       });
  //     });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    client.close();
    done();
  });
});
