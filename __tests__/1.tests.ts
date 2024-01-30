import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";

describe("should return API data", () => {

  beforeAll(async ()=>{
    await request(app).delete('/testing/all-data').expect(204)
  })

    it("- GET all posts", async () => {
    await request(app)
      .get("/posts")
      .expect(200);
  });

    it("- POST create the blog with data", async function () {
    const response = await request(app)
      .post("/blogs/")
      .auth("admin", "qwerty")
      .send({
        name: "blog name",
        description: "blog description",
        websiteUrl: "https://www.websiteUrl",
      })
      .expect(201);

    const responseNewBlog = response.body;
    
    // сохранить в локальный стейт Value
    expect.setState({memorisedNewBlogId:response.body.id})
    // ================================================

    expect(responseNewBlog).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
      isMembership: false,
      createdAt: expect.any(String),
    });
  });

  it("- GET blog with memo id", async () => {
    const {memorisedNewBlogId} = expect.getState()
    const responseBlog = await request(app)
    .get("/blogs/"+ memorisedNewBlogId)
    
     expect(responseBlog.body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
      isMembership: false,
      createdAt: expect.any(String),
    });

  });

  it("- POST create NEO POST", async function () {
    const {memorisedNewBlogId} = expect.getState()
    const responseNewPost = await request(app)
      .post("/posts/")
      .auth("admin", "qwerty")
      // .set('Authorization', token)
      .send({
        title: "post title",
        shortDescription: "post shortDescription",
        content: "content of post",
        blogId: `${memorisedNewBlogId}`
      })
      .expect(201);
  });

  it("- GET created POST", async function () {
    const {memorisedNewBlogId} = expect.getState()
    const responseNewPost = await request(app)
      .get("/posts/")
      // .auth("admin", "qwerty")
      // .set('Authorization', token)
      // .expect(200);

      expect(responseNewPost.body.items).toEqual({
        title: "post title",
        shortDescription: "post shortDescription",
        content: "content of post",
        blogId: `${memorisedNewBlogId}`,
        createdAt: expect.any(String),
        blogName: "blog name", 
        id: expect.any(String),
      });

  });

  afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    client.close()
    done()
  })



});
