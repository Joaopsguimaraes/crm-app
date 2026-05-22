# crm-app

CRM application for sales teams that need a fast, clean workspace to manage the complete commercial flow: prospects, customers, contacts, products, budgets, opportunities, sales, and the financial information related to each sale.

The application is designed for users who are already comfortable with Excel and ERP-style interfaces. The UI must prioritize speed, dense but readable information, editable data grids, fast forms, and flows that let salespeople register partial data during prospecting and complete it later.

## Application Intent

This CRM should help users:

- Register customers and prospects, even with minimal information such as only a name.
- Add and maintain customer contacts.
- Create and manage products, prices, discounts, and product price ranges.
- Create budgets and convert approved budgets into sales.
- Track opportunities through the sales pipeline, including won and lost opportunities.
- Register sales and manage financial information related to each sale.
- Share customer, opportunity, budget, and sales views between salespeople through URL-driven screens.
- Analyze commercial performance through reports and operational dashboards.

## Main Business Areas

- `Customers`: companies or people in prospecting, active negotiation, or already sold to.
- `Contacts`: people related to a customer, including decision makers and operational contacts.
- `Products`: sellable items with pricing, discounts, and commercial rules.
- `Budgets`: commercial proposals that can later become sales.
- `Opportunities`: sales pipeline records used to track negotiation status, probability, owner, and expected value.
- `Sales`: confirmed deals created directly or converted from budgets.
- `Finance`: payment, billing, receivable, and sale-related financial management.
- `Reports`: operational and management views for sales and commercial analysis.

## Reporting Goals

The application should support reports such as:

- Sales per month.
- Won opportunities.
- Budgets converted into sales.
- Salesperson performance.
- Customer totals and customer growth.
- Product prices and discounts.
- Product price ranges.
- Sales pipeline and conversion metrics.
- Finance indicators related to registered sales.

Reports should be filterable, shareable through the URL when possible, and aligned with the same data model used by the operational screens.

## UI And UX Principles

- Keep the interface clean, fast, and familiar for Excel and ERP users.
- Use editable data grids when users need to scan, compare, and update many records.
- Prefer compact, efficient forms that can be filled quickly.
- Allow progressive registration: a customer can start with little data during prospecting and receive more details later.
- Avoid unnecessary steps before users can save useful commercial information.
- Make search, filtering, sorting, and column visibility first-class behavior in list screens.
- Keep important screen state in the URL whenever it should be shareable, restorable, or collaborative.
- Avoid UI patterns that hide important data behind too many clicks.

## Architecture

This repository is a pnpm monorepo with:

- `apps/web`: NextJS frontend.
- `apps/api`: NestJS backend.
- `packages/shared`: shared TypeScript types and reusable contracts.
- `packages/typescript-config`: shared strict TypeScript configs.
- `packages/eslint-config`: shared strict ESLint configs with app-specific NextJS and NestJS rules.
- `packages/prettier-config`: shared Prettier config.

## API Architecture

The `apps/api` package must follow NestJS standards and an MVC-oriented structure:

- Use controllers for HTTP routing and request/response boundaries.
- Use services for business logic and application use cases.
- Use modules to organize business domains such as customers, contacts, products, budgets, opportunities, sales, finance, and reports.
- Keep DTOs explicit for input validation and API contracts.
- Keep domain rules out of controllers.
- Prefer dependency injection through Nest providers instead of manually wiring dependencies.
- Keep shared contracts in `packages/shared` when both frontend and backend need the same types.

## Frontend Architecture

The `apps/web` package must follow React and NextJS standards:

- Use ReactJS patterns that keep components small, predictable, and easy to test.
- Prefer Context API for shared application state instead of adding Zustand.
- Prefer URL-driven state for filters, pagination, sorting, selected records, tabs, and report parameters when those states should be shareable.
- Prefer React `use()` and server/data loading patterns where they fit the NextJS architecture, instead of using `useEffect()` as the default data-fetching mechanism.
- Use `useRef()` only for imperative DOM access, stable mutable values, or integration points where state would cause unnecessary renders.
- Avoid unnecessary re-renders by keeping state local, memoizing only when it has a clear benefit, and passing stable props to large grids or heavy components.
- Avoid race conditions in async UI flows by using cancellable requests, request identity checks, server actions, or route-driven loading boundaries where appropriate.
- Keep forms fast and resilient, with validation that helps the user complete work without blocking partial prospecting data.
- Use data-grid patterns for operational records that need inline editing, column control, sorting, filtering, and high-density review.

## Testing Policy

Tests are required in this application. Every use case, hook, service, controller, model, helper, and shared contract MUST have focused automated tests before it is considered complete.

Testing is necessary here because the CRM will contain business rules that affect customer history, commercial decisions, budgets, sales, finance data, and reports. A regression in these areas can create incorrect operational records, lost context, or wrong management indicators. Tests must verify observable behavior and protect the domain rules that users rely on.

Use the smallest reliable test type for each behavior:

- `Unit tests`: verify isolated business logic, helpers, hooks, models, use cases, and services. Keep these fast and deterministic.
- `Integration tests`: verify how application pieces work together, especially NestJS controllers, services, modules, validation, dependency injection, and API boundaries.
- `E2E tests`: verify the most important frontend user workflows through the browser with Playwright.

Frontend testing rules:

- Use Vitest and React Testing Library for component, hook, helper, and use-case unit tests.
- Use Playwright for browser-level e2e tests.
- Add tests beside the unit being tested with `*.test.ts` or `*.test.tsx`.
- Keep e2e tests in `apps/web/tests/e2e`.
- Prefer user-visible assertions such as headings, labels, validation messages, table rows, navigation state, and saved data.
- Avoid testing implementation details such as private functions, internal React state names, or incidental DOM structure.

API testing rules:

- Use Jest for unit and integration tests.
- Use `@nestjs/testing` for NestJS integration tests.
- Use `supertest` for HTTP boundary tests.
- Add unit tests beside the unit being tested with `*.spec.ts`.
- Keep integration tests in `apps/api/test` with `*.integration-spec.ts`.
- Controllers must be tested through HTTP integration tests when route behavior, status codes, validation, serialization, or dependency wiring matters.
- Services and use cases must be tested directly when they own business rules.

Mocks and in-memory tests:

- Prefer real code paths and in-memory data when the behavior can be tested without external infrastructure.
- Use mocks for external systems, slow dependencies, nondeterministic dependencies, or infrastructure boundaries such as email, payment, queues, storage, third-party APIs, and database adapters.
- Use `jest-mock` in API tests when a dependency needs to be replaced.
- Use Vitest mocks in frontend tests for browser APIs, NextJS navigation, timers, and network boundaries.
- Use `@faker-js/faker` to build realistic test data when examples need varied names, documents, emails, phone numbers, dates, or commercial values.
- Keep fake data explicit when the exact value is important for the assertion.

Each new feature should include at least:

- Unit tests for business rules and pure transformations.
- Integration tests for API boundaries or cross-module behavior.
- E2E tests for critical user workflows.
- Regression tests for every bug fix.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

## API Documentation

Swagger documentation for the NestJS API is generated from controller and DTO decorators.

```bash
pnpm install
pnpm --filter @crm/api dev
```

Open the Swagger UI at `http://localhost:3001/api/docs`.

The generated OpenAPI JSON is available at `http://localhost:3001/api/docs-json`.

Update the related controller, DTO, and response decorators when endpoint contracts change.

### Test Commands

```bash
# Frontend unit tests
pnpm --filter @crm/web test:unit
pnpm --filter @crm/web test:unit:watch
pnpm --filter @crm/web test:unit:ui

# Frontend e2e tests
pnpm --filter @crm/web test:e2e
pnpm --filter @crm/web test:e2e:headed
pnpm --filter @crm/web test:e2e:ui

# API tests
pnpm --filter @crm/api test
pnpm --filter @crm/api test:unit
pnpm --filter @crm/api test:integration
pnpm --filter @crm/api test:watch
```
