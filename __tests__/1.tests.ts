import request from "supertest";
import { app } from "../src/settings";

describe("should return API data", () => {
  it("- GET all posts with id 1", async () => {
    await request(app)
      .get("/posts/" + 1)
      .expect(200);
  });

  it("- POST create the blog with data", async function () {
    const response = await request(app)
      .post("/blogs/")
      .auth("admin", "qwerty")
      .send({
        name: "name",
        description: "description",
        websiteUrl: "https://www.websiteUrl",
      })
      .expect(201);

    const responseData = response.body;
    
    // сохранить в локальный стейт Value
    expect.setState({memorisedBody:response.body})
    const {memorisedBody} = expect.getState()
    // ================================================

    expect(responseData).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
    });
  });
});
