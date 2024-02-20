// Библиотека для тестирования в виртуальной базе а не реальной
// import {MongoMemoryServer} from "mongodb-memory-server"
// const virtualMongoServer = await MongoMemoryServer.create()
// const mongoURL = virtualMongoServer.getUri() 
// ---------------------------------------------------------------------
// integration tests link:
// 
// ---------------------------------------------------------------------

import request from "supertest";
import { app } from "../src/settings";
import { client } from "../src/BD/db";

describe("should return API data", () => {

  const user = {
    login: "newLogin",
    password: "new_password"
  }

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });


  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    client.close();
    done();
  });
});
