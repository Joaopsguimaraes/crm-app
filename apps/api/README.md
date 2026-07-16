# @crm/api

NestJS backend for the CRM application. This package owns HTTP API boundaries,
request validation, application services, TypeORM persistence, migrations, and
API integration tests.

The first implemented business module is `Customers`, based on:

- `docs/customer/domain.md` for business language and rules.

## Package Shape

```text
apps/api
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── swagger.ts
│   ├── validation.ts
│   ├── data-source.ts
│   ├── customers
│   │   ├── dto
│   │   ├── entities
│   │   ├── enums
│   │   ├── removal
│   │   ├── responses
│   │   ├── customers.controller.ts
│   │   ├── customers.module.ts
│   │   └── customers.service.ts
│   └── database
│       └── migrations
└── test
```

## Runtime

The API reads environment variables from `apps/api/.env` first, then `.env`.
Use `apps/api/.env.example` as the local template.

```env
PORT=3001

POSTGRES_HOST=localhost
POSTGRES_PORT=55432
POSTGRES_USER=crm
POSTGRES_PASSWORD=crm
POSTGRES_DB=crm
DATABASE_SSL=false
```

Start the API:

```bash
pnpm --filter @crm/api dev
```

The API listens on `http://localhost:3001` by default.

## Database

This package uses TypeORM with Postgres. Runtime schema synchronization is
disabled; schema changes must go through migrations.

Build before running migration commands because TypeORM reads the compiled
`dist/data-source.js` file.

```bash
pnpm --filter @crm/api build
pnpm --filter @crm/api migration:run
pnpm --filter @crm/api migration:revert
```

## API Documentation

Swagger is configured from controller, DTO, and response decorators.

- Swagger UI: `http://localhost:3001/api/docs`
- OpenAPI JSON: `http://localhost:3001/api/docs-json`

Keep Swagger decorators current when route contracts change.

## Customer Module

`Customer` is the central commercial record. It can represent a company or a
person and can exist with minimal information before sales, opportunities,
finance, or mature commercial history exist.

Important rules owned by the API:

- Customer creation requires only `name`.
- Customer records may be incomplete and can be enriched later.
- `name` is not unique.
- Duplicate detection is advisory and must not block creation.
- Default Customer lists return only `active` records.
- `inactive`, `blocked`, and `archived` records are hidden unless requested.
- `archived` is preservation, not hard deletion.
- `blocked` is a signal for other domains; it does not block Customer-module maintenance.
- Contacts and addresses belong to exactly one Customer.
- Contact and address removal hard-deletes unreferenced records and soft-deletes records with dependent history.
- Soft-deleted contacts and addresses are hidden from default nested lists.
- Exactly one non-deleted default address may exist per Customer.

Current Customer routes:

| Method | Path                                      | Purpose                         |
| ------ | ----------------------------------------- | ------------------------------- |
| POST   | `/customers`                              | Create Customer                 |
| GET    | `/customers`                              | List Customers                  |
| GET    | `/customers/:id`                          | Retrieve Customer               |
| PATCH  | `/customers/:id`                          | Update Customer fields          |
| PATCH  | `/customers/:id/status`                   | Change operational status       |
| POST   | `/customers/:id/archive`                  | Archive Customer                |
| POST   | `/customers/:id/unarchive`                | Restore archived Customer       |
| POST   | `/customers/:id/contacts`                 | Create Customer contact         |
| GET    | `/customers/:id/contacts`                 | List Customer contacts          |
| PATCH  | `/customers/:id/contacts/:contactId`      | Update Customer contact         |
| DELETE | `/customers/:id/contacts/:contactId`      | Remove Customer contact         |
| POST   | `/customers/:id/addresses`                | Create Customer address         |
| GET    | `/customers/:id/addresses`                | List Customer addresses         |
| PATCH  | `/customers/:id/addresses/:addressId`     | Update Customer address         |
| DELETE | `/customers/:id/addresses/:addressId`     | Remove Customer address         |

`apps/api/requests.http` contains REST Client examples for health, Swagger, and
Customer routes.

## Validation

Global validation is configured in `src/validation.ts`:

- `transform: true`
- `whitelist: true`
- `forbidNonWhitelisted: true`

DTOs are the HTTP input boundary. Keep request normalization and validation in
DTOs or DTO helper transformers, not in controllers.

## Testing

Use Jest for unit and integration tests.

```bash
pnpm --filter @crm/api typecheck
pnpm --filter @crm/api lint
pnpm --filter @crm/api test:unit
pnpm --filter @crm/api test:integration
```

Testing conventions:

- Unit tests live beside the code with `*.spec.ts`.
- Integration tests live in `apps/api/test` with `*.integration-spec.ts`.
- Use service unit tests for business rules.
- Use HTTP integration tests for route behavior, validation, serialization,
  persistence, and Nest module wiring.

## Architecture Rules

- Controllers own HTTP routing and request/response boundaries only.
- Services own use cases and domain rule enforcement.
- Entities map persistence; do not return entities directly from controllers.
- Response classes define public API shape and Swagger metadata.
- Keep Customer contracts in `apps/api` until a real cross-package consumer
  requires shared contracts.
- Do not put frontend state, UI flow, or screen decisions in this package.
- Do not add operational Customer hard delete routes.
- Avoid logging raw Customer request bodies because records can contain PII.
