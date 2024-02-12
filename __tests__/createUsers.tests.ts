import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";
import { createUsers } from "./utils";

describe("should return API data", () => {
  const user = {
    login: "newLogin",
    password: "new_password",
  };

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });

  it("- GET all users", async () => {
    await request(app).get("/users").expect(200);
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    client.close();
    done();
  });
});
