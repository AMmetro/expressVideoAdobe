import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";
import { createUsers } from "./utils";
import { OutputPostType } from "../src/models/post/output/post.output";

describe("should return API data", () => {
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
        login: "newLogin",
        password: "new_password",
        email: "email56010@gg.com",
        // email: "ema4353",
      })
      .expect(201);

    expect.setState({ memorisedNewUserId: responseNewUser.body.id });

    expect(responseNewUser.body).toEqual({
      id: expect.any(String),
      login: expect.any(String),
      email: expect.any(String),
      createdAt: expect.any(String),
    });
  });

    it("- POST create many users and check returned pagination", async () => {
    const createdUsers: any[] = []
    for (let i = 0; i < 11; i++) {
      const user = await createUsers(app, i)
       createdUsers.push(user)
    }
    const responseUsers = await request(app)
    .get("/users/?pagesCount=4&pageSize=3")
     expect(responseUsers.body).toEqual({
        pagesCount: 4,
        page: 1,
        pageSize: 3,
        totalCount: 12,
        items: expect.any(Array<OutputPostType>)
    });
  });

  it("- GET users after request with query", async () => {
    const responseUsers = await request(app)
    .get("/users/?pageSize=15&pageNumber=1&searchLoginTerm=seR&searchEmailTerm=.com&sortDirection=asc&sortBy=login")
     expect(responseUsers.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 15,
        totalCount: 11,
        items: expect.any(Array<OutputPostType>)
    });
  });


  // it("- GET blog with memo id", async () => {
  //   const {memorisedNewBlogId} = expect.getState()
  //   const responseBlog = await request(app)
  //   .get("/blogs/"+ memorisedNewBlogId)

  //    expect(responseBlog.body).toEqual({
  //     id: expect.any(String),
  //     name: expect.any(String),
  //     description: expect.any(String),
  //     websiteUrl: expect.any(String),
  //     isMembership: false,
  //     createdAt: expect.any(String),
  //   });
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
