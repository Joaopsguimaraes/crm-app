# Customer Identity Enrichment

## What to build

Allow an existing customer to be enriched with optional identity and
communication data after fast prospect creation.

Users should be able to update `legalName`, `documentType`, `documentNumber`,
`email`, and `phone`. Document data must stay internally consistent: if a
document type is provided, a document number should also be provided, and if a
document number is provided, a document type should also be provided.

## Acceptance criteria

- [ ] A customer can be updated with optional `legalName`.
- [ ] A customer can be updated with optional `documentType` and `documentNumber`.
- [ ] Supported document types are `cpf`, `cnpj`, `foreign`, and `other`.
- [ ] A customer can be updated with optional `email` and `phone`.
- [ ] Updates reject document type without document number.
- [ ] Updates reject document number without document type.
- [ ] The frontend allows editing the enriched customer fields.
- [ ] Tests cover successful enrichment and document consistency validation.

## Blocked by

- [01-fast-prospect-creation.md](./01-fast-prospect-creation.md)
