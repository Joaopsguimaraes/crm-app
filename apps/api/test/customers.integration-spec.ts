import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import request from "supertest";
import { DataSource } from "typeorm";
import { CustomersModule } from "../src/customers/customers.module";
import { CustomerStatus } from "../src/customers/enums/customer-status.enum";
import { CustomerAddress } from "../src/customers/entities/customer-address.entity";
import { CustomerContact } from "../src/customers/entities/customer-contact.entity";
import { Customer } from "../src/customers/entities/customer.entity";
import { configureValidation } from "../src/validation";

describe("Customers API integration", () => {
  let app: INestApplication;
  const testSchema = "customer_api_integration_test";

  beforeAll(async () => {
    await createTestSchema(testSchema);

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.POSTGRES_HOST ?? "localhost",
          port: Number(process.env.POSTGRES_PORT ?? "5432"),
          username: process.env.POSTGRES_USER ?? "crm",
          password: process.env.POSTGRES_PASSWORD ?? "crm",
          database: process.env.POSTGRES_DB ?? "crm",
          entities: [Customer, CustomerContact, CustomerAddress],
          schema: testSchema,
          synchronize: true,
          dropSchema: true
        }),
        CustomersModule
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    configureValidation(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await dropTestSchema(testSchema);
  });

  it("creates a minimal customer and rejects invalid customer input", async () => {
    const created = await request(app.getHttpServer())
      .post("/customers")
      .send({ name: "Maria Silva" })
      .expect(201);

    expect(created.body).toMatchObject({
      name: "Maria Silva",
      status: CustomerStatus.Active,
      completeness: {
        hasPrimaryChannel: false,
        hasAddress: false,
        pending: ["primary_channel", "address"]
      }
    });

    await request(app.getHttpServer()).post("/customers").send({ notes: "missing name" }).expect(400);
    await request(app.getHttpServer())
      .post("/customers")
      .send({ name: "Extra", unexpected: true })
      .expect(400);
  });

  it("keeps duplicate names advisory and lists active customers by default", async () => {
    const first = await request(app.getHttpServer()).post("/customers").send({ name: "ACME Ltda" }).expect(201);
    const second = await request(app.getHttpServer()).post("/customers").send({ name: "ACME Ltda" }).expect(201);

    expect(second.body.duplicateSignals).toEqual([{ customerId: first.body.id, fields: ["name"] }]);

    await request(app.getHttpServer())
      .patch(`/customers/${second.body.id}/status`)
      .send({ status: CustomerStatus.Blocked })
      .expect(200);

    const defaultList = await request(app.getHttpServer()).get("/customers").expect(200);
    expect(
      defaultList.body.data.every((customer: { status: CustomerStatus }) => customer.status === CustomerStatus.Active)
    ).toBe(true);

    const explicitList = await request(app.getHttpServer())
      .get("/customers")
      .query({ status: "active,blocked" })
      .expect(200);
    expect(explicitList.body.data.map((customer: { id: string }) => customer.id)).toContain(second.body.id);
  });

  it("archives, hides, unarchives, and still allows maintenance while archived", async () => {
    const created = await request(app.getHttpServer()).post("/customers").send({ name: "Archive Me" }).expect(201);

    await request(app.getHttpServer()).post(`/customers/${created.body.id}/archive`).expect(201);
    await request(app.getHttpServer())
      .patch(`/customers/${created.body.id}`)
      .send({ notes: "Updated while archived" })
      .expect(200);

    const defaultList = await request(app.getHttpServer()).get("/customers").expect(200);
    expect(defaultList.body.data.map((customer: { id: string }) => customer.id)).not.toContain(created.body.id);

    const unarchived = await request(app.getHttpServer()).post(`/customers/${created.body.id}/unarchive`).expect(201);
    expect(unarchived.body.status).toBe(CustomerStatus.Active);
  });

  it("scopes contacts and addresses to their customer and enforces one default address", async () => {
    const first = await request(app.getHttpServer()).post("/customers").send({ name: "First Customer" }).expect(201);
    const second = await request(app.getHttpServer()).post("/customers").send({ name: "Second Customer" }).expect(201);

    const contact = await request(app.getHttpServer())
      .post(`/customers/${first.body.id}/contacts`)
      .send({ name: "Joao Silva", role: "financial" })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/customers/${second.body.id}/contacts/${contact.body.id}`)
      .send({ name: "Wrong" })
      .expect(404);

    const firstAddress = await request(app.getHttpServer())
      .post(`/customers/${first.body.id}/addresses`)
      .send({ type: "billing", isDefault: true, city: "Sao Paulo" })
      .expect(201);
    const secondAddress = await request(app.getHttpServer())
      .post(`/customers/${first.body.id}/addresses`)
      .send({ type: "shipping", isDefault: true, city: "Campinas" })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/customers/${second.body.id}/addresses/${firstAddress.body.id}`)
      .send({ city: "Wrong" })
      .expect(404);

    const addresses = await request(app.getHttpServer()).get(`/customers/${first.body.id}/addresses`).expect(200);
    const defaults = addresses.body.filter((address: { isDefault: boolean }) => address.isDefault);

    expect(defaults).toHaveLength(1);
    expect(defaults[0].id).toBe(secondAddress.body.id);
  });

  it("hard deletes unreferenced nested records by default", async () => {
    const customer = await request(app.getHttpServer()).post("/customers").send({ name: "Nested Delete" }).expect(201);
    const contact = await request(app.getHttpServer())
      .post(`/customers/${customer.body.id}/contacts`)
      .send({ name: "Temporary Contact" })
      .expect(201);
    const address = await request(app.getHttpServer())
      .post(`/customers/${customer.body.id}/addresses`)
      .send({ city: "Sao Paulo" })
      .expect(201);

    await request(app.getHttpServer()).delete(`/customers/${customer.body.id}/contacts/${contact.body.id}`).expect(204);
    await request(app.getHttpServer()).delete(`/customers/${customer.body.id}/addresses/${address.body.id}`).expect(204);

    const contacts = await request(app.getHttpServer()).get(`/customers/${customer.body.id}/contacts`).expect(200);
    const addresses = await request(app.getHttpServer()).get(`/customers/${customer.body.id}/addresses`).expect(200);

    expect(contacts.body).toEqual([]);
    expect(addresses.body).toEqual([]);
  });
});

async function createTestSchema(schema: string): Promise<void> {
  const dataSource = await createAdminDataSource();
  await dataSource.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
  await dataSource.destroy();
}

async function dropTestSchema(schema: string): Promise<void> {
  const dataSource = await createAdminDataSource();
  await dataSource.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  await dataSource.destroy();
}

async function createAdminDataSource(): Promise<DataSource> {
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? "5432"),
    username: process.env.POSTGRES_USER ?? "crm",
    password: process.env.POSTGRES_PASSWORD ?? "crm",
    database: process.env.POSTGRES_DB ?? "crm",
    synchronize: false
  });

  return dataSource.initialize();
}
