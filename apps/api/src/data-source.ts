import "reflect-metadata";
import { config } from "dotenv";
import { DataSource } from "typeorm";
import { CustomerAddress } from "./customers/entities/customer-address.entity";
import { CustomerContact } from "./customers/entities/customer-contact.entity";
import { Customer } from "./customers/entities/customer.entity";
import { CreateCustomerTables1715840000000 } from "./database/migrations/1715840000000-create-customer-tables";

config({ path: "apps/api/.env" });
config();

export default new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  port: Number(process.env.POSTGRES_PORT ?? "5432"),
  username: process.env.POSTGRES_USER ?? "crm",
  password: process.env.POSTGRES_PASSWORD ?? "crm",
  database: process.env.POSTGRES_DB ?? "crm",
  entities: [Customer, CustomerContact, CustomerAddress],
  migrations: [CreateCustomerTables1715840000000],
  synchronize: false,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
});
