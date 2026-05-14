# PRD: Customer Module

## Problem Statement

Sales teams need a fast, reliable way to register prospects and customers in
the CRM without forcing complete data entry up front. During prospecting, users
often know only a name and whether the record is a person or company. Later,
they need to enrich that same record with legal data, documents, addresses,
contacts, assignment, and lifecycle status.

The current application does not yet have a customer module. Without a clear
customer model, later modules such as opportunities, budgets, sales, finance,
and reports would each make their own assumptions about what a customer is.
That would create duplicated logic, weak validation, and inconsistent customer
data across the commercial flow.

## Solution

Build a customer module that treats `Customer` as the aggregate root for both
prospects and actual customers. The module will support progressive
registration, explicit lifecycle status, customer-owned addresses and contacts,
and an external salesperson reference.

Users will be able to create a customer with only the minimum useful data,
enrich that record over time, manage many addresses, manage many contacts, and
filter customers by lifecycle and identity fields. The first version will keep
the model intentionally small while avoiding weak fields such as a single
`isActive` boolean for the customer lifecycle.

## User Stories

1. As a salesperson, I want to create a prospect with only a display name and customer type, so that I can register commercial interest quickly.
2. As a salesperson, I want new customers to default to prospect status, so that I do not need to choose a lifecycle value during fast registration.
3. As a salesperson, I want to classify a customer as a person or company, so that the CRM can present the right business language.
4. As a salesperson, I want to store a customer display name, so that I can recognize the customer in lists, searches, and forms.
5. As a salesperson, I want to optionally store a customer legal name, so that company or official records can be completed later.
6. As a salesperson, I want to leave legal name empty during prospecting, so that incomplete data does not block useful registration.
7. As a salesperson, I want to store customer document type and document number separately, so that CPF, CNPJ, foreign, and other documents are clear.
8. As a salesperson, I want customer documents to be optional, so that early prospecting records can be saved.
9. As a salesperson, I want to store customer email and phone, so that simple communication data is available without creating a contact first.
10. As a salesperson, I want to assign a customer to a salesperson when known, so that customer ownership can be represented.
11. As a sales manager, I want salesperson assignment to reference the external salesperson module, so that salesperson data is not duplicated inside customers.
12. As a salesperson, I want to mark a customer as prospect, active, inactive, or blocked, so that the commercial lifecycle is clear.
13. As a salesperson, I want to activate a prospect, so that the same record can move into normal commercial operation.
14. As a salesperson, I want to inactivate a customer, so that historical customers remain available without appearing as active commercial targets.
15. As a manager, I want to block a customer, so that restricted customers can be prevented from new commercial operations later.
16. As a salesperson, I want blocked customers to remain visible for history, so that past opportunities, budgets, and sales are not lost.
17. As a salesperson, I want to add many addresses to a customer, so that customers with different locations can be represented.
18. As a salesperson, I want to classify addresses as main, billing, or other, so that downstream flows can choose the right address.
19. As a salesperson, I want only one main address per customer, so that the CRM has a clear default address.
20. As a salesperson, I want address fields to allow partial information, so that an incomplete address can be saved and completed later.
21. As a salesperson, I want to add many contacts to a customer, so that I can manage different people related to the same customer.
22. As a salesperson, I want contacts to require only a name, so that I can quickly register a person even without full details.
23. As a salesperson, I want contact email and phone to be optional, so that missing contact data does not block registration.
24. As a salesperson, I want contacts to be active or inactive, so that outdated contact people can remain historically visible.
25. As a salesperson, I want contacts to avoid role/type fields for now, so that the first version stays simple.
26. As a salesperson, I want to list customers in a dense operational screen, so that I can scan and compare records quickly.
27. As a salesperson, I want to search customers by display name, document, email, and phone, so that I can find records using the information I have.
28. As a salesperson, I want to filter customers by status, so that I can focus on prospects, active customers, inactive customers, or blocked customers.
29. As a salesperson, I want to filter customers by customer type, so that person and company records can be reviewed separately.
30. As a salesperson, I want customer list state to be URL-driven where practical, so that I can share or reopen the same view.
31. As a salesperson, I want to open a customer detail page, so that I can review and edit all customer information in one place.
32. As a salesperson, I want to update customer identity fields, so that corrected or completed data can be saved.
33. As a salesperson, I want to add, update, and remove customer addresses, so that location data stays current.
34. As a salesperson, I want to add, update, and remove customer contacts, so that relationship data stays current.
35. As a salesperson, I want validation errors to explain the invalid field clearly, so that I can fix customer data quickly.
36. As a sales manager, I want customer lifecycle data to be reliable, so that reports can distinguish prospects, active customers, inactive customers, and blocked customers.
37. As a developer, I want customer rules encapsulated outside controllers, so that HTTP routing does not become the business logic layer.
38. As a developer, I want shared customer contracts where needed by frontend and backend, so that UI and API payloads do not drift.
39. As a developer, I want the customer module organized as a NestJS domain module, so that it follows the repository architecture.
40. As a developer, I want address and contact behavior isolated behind customer module services, so that child resource rules can be tested independently.

## Implementation Decisions

- Build a customer module in the NestJS API using the repository's MVC-oriented NestJS style.
- `Customer` is the aggregate root for the module.
- `Address` and `Contact` are customer-owned child records.
- `Salesperson` is external to the customer module and is referenced by identifier only.
- Use one `Customer` entity for both prospects and actual customers.
- Model customer lifecycle with `status`: `prospect`, `active`, `inactive`, and `blocked`.
- Do not model customer lifecycle with only `isActive`.
- Model customer type explicitly as `person` or `company`.
- Use `displayName` as the required operational name.
- Use optional `legalName` for official or legal naming needs.
- Do not include `tradeName` in the first version.
- Model customer document data as `documentType` plus `documentNumber`.
- Supported document types are `cpf`, `cnpj`, `foreign`, and `other`.
- Keep customer `email` and `phone` as simple optional fields for now.
- Do not introduce `primaryEmail` or `primaryPhone` naming in the first version.
- Customers can have many addresses.
- Address type values are `main`, `billing`, and `other`.
- Enforce at most one `main` address per customer.
- Customers can have many contacts.
- Do not include contact role/type in the first version.
- Contact `isActive` remains useful because contacts can become outdated while the customer remains active.
- Minimum customer creation data is `displayName` and `customerType`.
- New customers default to `status: prospect`.
- Customer creation should not require document, email, phone, address, contact, or salesperson assignment.
- Customer update must preserve required-field validity and document consistency.
- Provide customer endpoints for listing, creation, detail, update, and deletion/lifecycle handling.
- Provide nested address endpoints under customers.
- Provide nested contact endpoints under customers.
- Treat customer deletion as an unresolved lifecycle decision rather than assuming hard deletion.
- Create deep, testable application services for customer lifecycle and child resource rules instead of putting business rules in controllers.
- Store shared request/response contracts in the shared package when both frontend and backend need them.
- Build the frontend around dense CRM workflows: list, filter, search, detail, edit, addresses, and contacts.
- Keep URL-driven state for customer list filters, pagination, sorting, and selected views where practical.

## Testing Decisions

- Tests should verify externally observable behavior: accepted inputs, rejected inputs, persisted state, API responses, lifecycle transitions, address rules, and contact behavior.
- Tests should avoid asserting internal implementation details such as private helper calls or controller-to-service wiring beyond what NestJS integration needs.
- Add API tests for customer creation with minimum data.
- Add API tests for customer creation with optional legal name, document, email, phone, and salesperson reference.
- Add API tests for defaulting new customers to `prospect`.
- Add API tests for rejecting empty `displayName`.
- Add API tests for rejecting missing `customerType`.
- Add API tests for document consistency when only `documentType` or only `documentNumber` is provided.
- Add service-level tests for customer status transitions once allowed transitions are finalized.
- Add service-level tests for address creation and the single-main-address rule.
- Add API tests for nested address creation, update, listing, and deletion.
- Add API tests for nested contact creation, update, listing, and deletion.
- Add API tests confirming contacts do not require role/type.
- Add frontend tests for customer list filtering and search once the frontend test stack is introduced.
- Add frontend tests for fast prospect creation once the frontend test stack is introduced.
- There are no existing test files in the repository yet, so this module should establish the first testing baseline for both API and frontend.

## Out of Scope

- Implementing the salesperson module.
- Implementing opportunities, budgets, sales, finance, or reports.
- Enforcing blocked-customer behavior in downstream commercial modules before those modules exist.
- Adding customer `tradeName`.
- Adding contact role/type.
- Adding address types beyond `main`, `billing`, and `other`.
- Building duplicate detection beyond the decisions finalized during implementation.
- Implementing salesperson assignment history.
- Implementing permissions around blocking, unblocking, deletion, or reassignment.
- Implementing full Brazilian CPF/CNPJ validation if the first delivery only needs structural document storage.
- Importing customers from spreadsheets.
- Exporting customers to spreadsheets.
- Building advanced reporting on customers.

## Further Notes

Open decisions remain around deletion behavior, duplicate detection, exact
status transition permissions, whether `documentType + documentNumber` must be
unique when present, contact visibility defaults, address replacement behavior,
and whether salesperson assignment becomes required when a customer becomes
active.

The current repository is a pnpm monorepo with a NestJS API, Next.js frontend,
and shared TypeScript package. The API currently has TypeORM configured for
Postgres but no implemented business modules yet.
