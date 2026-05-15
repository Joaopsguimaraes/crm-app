import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppController } from "../src/app.controller";
import { AppService } from "../src/app.service";

describe("AppController integration", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET / returns the CRM health response", async () => {
    const response = await request(app.getHttpServer()).get("/").expect(200);

    expect(response.body).toEqual({
      app: "crm-app",
      status: "ok",
      timestamp: expect.any(String)
    });
  });
});
