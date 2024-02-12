import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";
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

     expect.setState({ memorisedUserToken: responseUsers.body.accessToken })
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

    it("- POST create new BLOG for created User", async function () {
    const response = await request(app)
      .post("/blogs/")
      .auth("admin", "qwerty")
      // .set('Authorization', token)
      .send({
        name: "blog name",
        description: "description",
        websiteUrl: "https://www.someadess.com",
      })
      .expect(201)
      
      expect(response.body).toEqual({
        id: expect.any(String),
        isMembership: false,
        description: expect.any(String),
        name: expect.any(String),
        websiteUrl: expect.any(String),
        createdAt: expect.any(String),
      });

      expect.setState({ memorisedNewBlogId: response.body.id });

  });

    it("- POST create new POST for created BLOG", async function () {
    const {memorisedNewBlogId} = expect.getState()
    const response = await request(app)
      .post("/posts/")
      .auth("admin", "qwerty")
      // .set('Authorization', token)
      .send({
        title: "title",
        shortDescription: "shortDescription",
        content: "content",
        blogId: memorisedNewBlogId,
      })
      .expect(201);

      expect(response.body).toEqual({
        blogId: expect.any(String),
        blogName: expect.any(String),
        content: expect.any(String),
        id: expect.any(String),
        shortDescription: expect.any(String),
        title: expect.any(String),
        createdAt: expect.any(String),
      });
      expect.setState({ memorisedNewPostId: response.body.id });
      expect.setState({ memorisedNewBlogId: response.body.blogId });
  });

    it("- GET created POST", async function () {
    const {memorisedNewBlogId} = expect.getState()
    const {memorisedNewPostId} = expect.getState()
    const responseNewPost = await request(app)
      .get("/posts/" + memorisedNewPostId)
      .expect(200)

      expect(responseNewPost.body).toEqual({
        title: "title",
        shortDescription: "shortDescription",
        content: "content",
        blogId: `${memorisedNewBlogId}`,
        createdAt: expect.any(String),
        blogName: "blog name",
        id: expect.any(String),
      });
    });

    it("- POST create new COMMENT for created POST", async function () {
      const {memorisedNewPostId} = expect.getState()
      const {memorisedUserToken} = expect.getState()
      const response = await request(app)
        .post("/posts/" + memorisedNewPostId + "/comments/")
        .set('Authorization', `Bearer ${memorisedUserToken}`)
        .send({
          content: "comment content > 20 symbol",
        })
        .expect(201);
        expect(response.body).toEqual({
           commentatorInfo: {
               userId: expect.any(String),
               userLogin: expect.any(String),
               },
            content: expect.any(String),
            createdAt: expect.any(String),
            id: expect.any(String),
        });
        expect.setState({ memorisedNewCommentId: response.body.id });
    });

      it("- PUT update created COMMENT", async function () {
    const {memorisedNewCommentId} = expect.getState()
    const {memorisedUserToken} = expect.getState()
    const responseUpdatedPost = await request(app)
      .put("/comments/" + memorisedNewCommentId)
      .set('Authorization', `Bearer ${memorisedUserToken}`)
      .send({
        content: "updated content updated",
      })
      .expect(204);
    })

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    client.close();
    done();
  });
});
