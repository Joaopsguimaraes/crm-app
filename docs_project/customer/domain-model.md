# Customer Domain Model

## Aggregate Boundary

`Customer` is the aggregate root for the customer module.

`Address` and `Contact` belong to a customer and should not exist independently
from a customer in this first version.

`Salesperson` is not part of the customer aggregate. A customer may reference a
salesperson, but salesperson data and behavior belong to a separate module.

## Customer

```ts
type CustomerStatus = "prospect" | "active" | "inactive" | "blocked";

type CustomerType = "person" | "company";

type DocumentType = "cpf" | "cnpj" | "foreign" | "other";

interface Customer {
  id: string;
  displayName: string;
  legalName?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  documentType?: DocumentType;
  documentNumber?: string;
  email?: string;
  phone?: string;
  salespersonId?: string;
  addresses: Address[];
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}
```

### Customer Status

`prospect`
: Partially registered customer or commercial lead still in prospecting.

`active`
: Valid customer available for regular opportunities, budgets, and sales.

`inactive`
: Customer retained for history and reporting, but no longer active
commercially.

`blocked`
: Customer prevented from new commercial operations because of financial,
compliance, or administrative reasons.

### Customer Type

`person`
: A natural person.

`company`
: A legal company.

`customerType` is separate from `documentType`. CPF usually maps to `person`,
and CNPJ usually maps to `company`, but the model must allow missing, foreign,
or special documents.

### Names

`displayName` is the primary name used in lists, searches, URLs, forms, and
quick registration.

`legalName` is optional and should store the official legal name when needed.

`tradeName` is intentionally not part of the first version.

## Address

```ts
type AddressType = "main" | "billing" | "other";

interface Address {
  id: string;
  customerId: string;
  addressType: AddressType;
  addressLine: string;
  number?: string;
  neighborhood?: string;
  addressLine2?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}
```

Customers can have many addresses.

At most one address per customer can use `addressType: "main"`.

## Contact

```ts
interface Contact {
  id: string;
  customerId: string;
  name: string;
  documentType?: DocumentType;
  documentNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Customers can have many contacts.

Contact role/type is intentionally not part of the first version. It can be
introduced later when a concrete workflow needs it.

## Relationship Summary

- `Customer 1 -> many Address`
- `Customer 1 -> many Contact`
- `Customer many -> 1 Salesperson` by reference only
