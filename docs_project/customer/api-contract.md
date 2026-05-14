# Customer API Contract

This document describes the intended HTTP contract for the customer module. It
is not an implementation yet.

## Customer Endpoints

```txt
GET    /customers
POST   /customers
GET    /customers/:id
PATCH  /customers/:id
DELETE /customers/:id
```

`DELETE /customers/:id` should be treated as a lifecycle operation decision,
not automatically as hard deletion. The preferred first behavior is soft
removal or status transition, still to be finalized.

## Address Endpoints

```txt
GET    /customers/:customerId/addresses
POST   /customers/:customerId/addresses
GET    /customers/:customerId/addresses/:addressId
PATCH  /customers/:customerId/addresses/:addressId
DELETE /customers/:customerId/addresses/:addressId
```

## Contact Endpoints

```txt
GET    /customers/:customerId/contacts
POST   /customers/:customerId/contacts
GET    /customers/:customerId/contacts/:contactId
PATCH  /customers/:customerId/contacts/:contactId
DELETE /customers/:customerId/contacts/:contactId
```

## Create Customer Request

Minimum request:

```ts
interface CreateCustomerRequest {
  displayName: string;
  customerType: "person" | "company";
  status?: "prospect" | "active" | "inactive" | "blocked";
  legalName?: string;
  documentType?: "cpf" | "cnpj" | "foreign" | "other";
  documentNumber?: string;
  email?: string;
  phone?: string;
  salespersonId?: string;
}
```

Defaults:

```ts
status = "prospect";
```

## Update Customer Request

```ts
type UpdateCustomerRequest = Partial<CreateCustomerRequest>;
```

Updates must still respect validation rules, especially customer status,
document consistency, and required fields that cannot become empty.

## Create Address Request

```ts
interface CreateAddressRequest {
  addressType: "main" | "billing" | "other";
  addressLine: string;
  number?: string;
  neighborhood?: string;
  addressLine2?: string;
  city?: string;
}
```

## Create Contact Request

```ts
interface CreateContactRequest {
  name: string;
  documentType?: "cpf" | "cnpj" | "foreign" | "other";
  documentNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}
```

Defaults:

```ts
isActive = true;
```
