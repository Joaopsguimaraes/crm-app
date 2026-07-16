# AGENTS.md

Instructions for agents working in `apps/api`.

## Scope

This package is the NestJS backend for the CRM. It owns HTTP controllers,
DTO validation, application services, TypeORM entities, migrations, Swagger
metadata, and API tests.

Before changing Customer behavior, read:

- `../../docs/customer/domain.md`

The domain doc is the source of truth for business language, rules, and
decisions.

## Commands

Run package commands through pnpm filters from the repository root:

```bash
pnpm --filter @crm/api typecheck
pnpm --filter @crm/api lint
pnpm --filter @crm/api test:unit
pnpm --filter @crm/api test:integration
pnpm --filter @crm/api build
```

Migration commands require a build first:

```bash
pnpm --filter @crm/api build
pnpm --filter @crm/api migration:run
pnpm --filter @crm/api migration:revert
```

## Package Conventions

- Keep controllers thin. Put business decisions in services.
- Keep DTOs explicit. Validate and transform inputs at the HTTP boundary.
- Keep response mapping explicit. Do not expose TypeORM entities as API responses.
- Use Nest dependency injection for replaceable behavior and future module seams.
- Use TypeORM repositories and query builders instead of raw SQL unless a migration or measured query requires SQL.
- Keep runtime `synchronize` disabled. Schema changes require migrations.
- Keep Swagger decorators in sync with controllers, DTOs, and response classes.
- Add or update tests with behavior changes.

## Customer Rules

Preserve these rules unless the domain documentation changes first:

- Creating a Customer requires only `name`.
- A Customer may be incomplete and completed later.
- `name` is not unique.
- Duplicate signals are advisory and never block creation by themselves.
- Default Customer listing returns only `active` records.
- `inactive`, `blocked`, and `archived` records are excluded unless explicitly requested.
- `archived` means preserved and hidden by default, not deleted.
- Do not add a public operational Customer hard-delete endpoint.
- `blocked` is for other domains to block sensitive operations; Customer-domain maintenance remains allowed.
- Contacts and addresses are owned by exactly one Customer.
- Contact and address routes must enforce Customer ownership.
- Contact and address removal hard-deletes only when no dependent records exist; otherwise it soft-deletes.
- Soft-deleted contacts and addresses stay hidden from default nested lists.
- Only one non-deleted default address may exist per Customer.
- Customer completeness is advisory and currently tracks primary channel and address.
- CPF/CNPJ and fiscal completeness are out of scope for Customer API V1.

## Testing Expectations

- Unit-test service rules directly.
- Integration-test HTTP validation, status codes, serialization, route ownership checks, persistence, and module wiring.
- Add regression tests for every Customer rule bug.
- Prefer focused assertions on observable behavior over implementation details.
- Use mocks only for external or replaceable boundaries, such as dependency probes.

## Security And Privacy

Customer, contact, and address records can contain PII and commercial context.

- Do not log raw request bodies for write operations.
- Redact email, phone, notes, address lines, and future fiscal identifiers in logs.
- Keep field length limits on DTOs.
- Use parameterized repository/query-builder APIs.
- Auth and tenant scoping are not V1 features, but avoid design choices that make them hard to add later.

## Out Of Scope For This Package

- Frontend screens, grids, forms, URL state, and UI validation.
- Pipeline, opportunity, sales, finance, credit, invoicing, and reports behavior.
- Fiscal profile and invoice-specific validation.
- Automatic duplicate merge.
- Shared business DTOs in `packages/shared` unless there is a concrete cross-package consumer.
