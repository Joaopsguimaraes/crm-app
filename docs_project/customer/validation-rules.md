# Customer Validation Rules

## Customer

Required to create a customer:

- `displayName`
- `customerType`

Default values:

- `status`: `prospect`

Allowed statuses:

- `prospect`
- `active`
- `inactive`
- `blocked`

Allowed customer types:

- `person`
- `company`

Allowed document types:

- `cpf`
- `cnpj`
- `foreign`
- `other`

Rules:

- `displayName` cannot be empty.
- `legalName` is optional.
- `documentType` and `documentNumber` are optional for prospecting.
- If `documentNumber` is provided, `documentType` should also be provided.
- If `documentType` is provided, `documentNumber` should also be provided.
- `email` is optional.
- `phone` is optional.
- `salespersonId` is optional and references an external module.

## Address

Allowed address types:

- `main`
- `billing`
- `other`

Rules:

- A customer can have many addresses.
- A customer can have at most one `main` address.
- `addressLine` is required.
- `number`, `neighborhood`, `addressLine2`, and `city` are optional for the
  first version.

## Contact

Rules:

- A customer can have many contacts.
- `name` is required.
- `email` is optional.
- `phone` is optional.
- `address` is optional.
- `isActive` defaults to `true`.
- Contact role/type is not part of the first version.
