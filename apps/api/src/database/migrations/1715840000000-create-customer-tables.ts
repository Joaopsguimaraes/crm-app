import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomerTables1715840000000 implements MigrationInterface {
  name = "CreateCustomerTables1715840000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'archived', 'blocked')"
    );
    await queryRunner.query(
      "CREATE TYPE customer_contact_role AS ENUM ('commercial', 'financial', 'other')"
    );
    await queryRunner.query(
      "CREATE TYPE customer_address_type AS ENUM ('main', 'shipping', 'billing', 'other')"
    );

    await queryRunner.query(`
      CREATE TABLE customers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        status customer_status NOT NULL DEFAULT 'active',
        email text NULL,
        phone text NULL,
        notes text NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        archived_at timestamptz NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE customer_contacts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        name text NOT NULL,
        role customer_contact_role NOT NULL DEFAULT 'other',
        email text NULL,
        phone text NULL,
        notes text NULL,
        deleted_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE customer_addresses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        type customer_address_type NOT NULL DEFAULT 'main',
        is_default boolean NOT NULL DEFAULT false,
        line1 text NULL,
        line2 text NULL,
        city text NULL,
        state text NULL,
        postal_code text NULL,
        country text NULL,
        deleted_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query("CREATE INDEX idx_customers_status ON customers(status)");
    await queryRunner.query("CREATE INDEX idx_customers_name ON customers(name)");
    await queryRunner.query("CREATE INDEX idx_customers_email ON customers(email) WHERE email IS NOT NULL");
    await queryRunner.query("CREATE INDEX idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL");
    await queryRunner.query("CREATE INDEX idx_customers_created_at ON customers(created_at)");
    await queryRunner.query("CREATE INDEX idx_customer_contacts_customer_id ON customer_contacts(customer_id)");
    await queryRunner.query("CREATE INDEX idx_customer_contacts_customer_role ON customer_contacts(customer_id, role)");
    await queryRunner.query("CREATE INDEX idx_customer_contacts_deleted_at ON customer_contacts(deleted_at)");
    await queryRunner.query(
      "CREATE INDEX idx_customer_contacts_email ON customer_contacts(email) WHERE email IS NOT NULL"
    );
    await queryRunner.query(
      "CREATE INDEX idx_customer_contacts_phone ON customer_contacts(phone) WHERE phone IS NOT NULL"
    );
    await queryRunner.query("CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id)");
    await queryRunner.query("CREATE INDEX idx_customer_addresses_customer_type ON customer_addresses(customer_id, type)");
    await queryRunner.query("CREATE INDEX idx_customer_addresses_deleted_at ON customer_addresses(deleted_at)");
    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_customer_addresses_one_default
      ON customer_addresses(customer_id)
      WHERE is_default = true AND deleted_at IS NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_addresses_one_default");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_addresses_deleted_at");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_addresses_customer_type");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_addresses_customer_id");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_contacts_phone");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_contacts_email");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_contacts_deleted_at");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_contacts_customer_role");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customer_contacts_customer_id");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customers_created_at");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customers_phone");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customers_email");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customers_name");
    await queryRunner.query("DROP INDEX IF EXISTS idx_customers_status");
    await queryRunner.query("DROP TABLE IF EXISTS customer_addresses");
    await queryRunner.query("DROP TABLE IF EXISTS customer_contacts");
    await queryRunner.query("DROP TABLE IF EXISTS customers");
    await queryRunner.query("DROP TYPE IF EXISTS customer_address_type");
    await queryRunner.query("DROP TYPE IF EXISTS customer_contact_role");
    await queryRunner.query("DROP TYPE IF EXISTS customer_status");
  }
}
