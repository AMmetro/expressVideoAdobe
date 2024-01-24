import request from "supertest";
import { app } from "../src/settings";

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
      isMembership: true,
      createdAt: expect.any(String),

       // id: expect.any(String),
      // title: expect.any(String),
      // shortDescription: expect.any(String),
      // content: expect.any(String),
      // blogId: expect.any(String),
      // blogName: expect.any(String),
      // createdAt: expect.any(String),
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
      isMembership: true,
      createdAt: expect.any(String),
    });

  });

  it("- POST create NEO POST", async function () {
    const {memorisedNewBlogId} = expect.getState()
    const responseNewPost = await request(app)
      .post("/posts/")
      .auth("admin", "qwerty")
      .send({
        title: "post title",
        shortDescription: "post shortDescription",
        content: "content of post",
        blogId: `${memorisedNewBlogId}`
      })
      .expect(201);

    // const responseNewPostBody = responseNewPost.body;
    
    // expect(responseNewPostBody).toEqual({
    //    id: expect.any(String),
    //   title: expect.any(String),
    //   shortDescription: expect.any(String),
    //   content: expect.any(String),
    //   blogId: expect.any(String),
    //   blogName: expect.any(String),
    //   createdAt: expect.any(String),
    // });


  });




});
