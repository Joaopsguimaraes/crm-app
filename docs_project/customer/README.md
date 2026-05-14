# Customer Module

The customer module manages people and companies that the CRM can prospect,
negotiate with, sell to, and keep for historical reporting.

This module intentionally uses one `Customer` concept for both prospects and
actual customers. The customer lifecycle is represented by `status`, not by
separate prospect and customer entities.

## Scope

The customer module owns:

- `Customer`
- `Address`
- `Contact`

The customer module references, but does not own:

- `Salesperson`

`Salesperson` must be modeled in a separate module later. Customer records only
keep a salesperson reference when assignment is needed.

## Documentation

- [Domain Model](./domain-model.md)
- [API Contract](./api-contract.md)
- [Validation Rules](./validation-rules.md)
- [Workflows](./workflows.md)
- [Open Questions](./open-questions.md)

## Core Decisions

- `Customer` is the aggregate root.
- `Address` and `Contact` are customer-owned child records.
- `Salesperson` is external to this module.
- One customer entity represents both prospects and active customers.
- `status` replaces a weak `isActive`-only lifecycle.
- Customer documents are modeled as `documentType` and `documentNumber`.
- Customer type is explicit through `customerType`.
- Customer names use `displayName` and optional `legalName`.
- Customers can have many addresses.
- Addresses have `addressType`: `main`, `billing`, or `other`.
- Contacts can be many per customer, but do not need a role/type yet.
- The minimum customer creation data is intentionally small to support fast
  prospect registration.
