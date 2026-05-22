import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppController } from "../src/app.controller";
import { AppService } from "../src/app.service";
import { CustomersController } from "../src/customers/customers.controller";
import { CustomersService } from "../src/customers/customers.service";
import { configureSwagger } from "../src/swagger";

describe("AppController integration", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController, CustomersController],
      providers: [
        AppService,
        {
          provide: CustomersService,
          useValue: {}
        }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    configureSwagger(app);
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

  it("GET /api/docs returns Swagger UI", async () => {
    const response = await request(app.getHttpServer()).get("/api/docs").expect(200);

    expect(response.text).toContain("Swagger UI");
  });

  it("GET /api/docs-json returns OpenAPI JSON with customer paths", async () => {
    const response = await request(app.getHttpServer()).get("/api/docs-json").expect(200);

    expect(response.body.info).toMatchObject({
      title: "CRM API",
      description: "CRM backend API documentation",
      version: "0.1.0"
    });
    expect(response.body.tags).toContainEqual(expect.objectContaining({ name: "customers" }));
    expect(Object.keys(response.body.paths)).toEqual(
      expect.arrayContaining(["/customers", "/customers/{id}", "/customers/{id}/contacts", "/customers/{id}/addresses"])
    );
  });
});
