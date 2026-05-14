# Customer List Search And Filters

## What to build

Build a dense operational customer list that supports scanning, searching, and
filtering customer records.

Users should be able to search customers by available identity and
communication fields, filter by customer status, filter by customer type, and
share or restore list state through the URL where practical.

## Acceptance criteria

- [ ] The customer list shows key customer fields in a dense, readable layout.
- [ ] Users can search by display name.
- [ ] Users can search by document data when present.
- [ ] Users can search by email and phone when present.
- [ ] Users can filter by status.
- [ ] Users can filter by customer type.
- [ ] Filter, search, pagination, and sorting state are URL-driven where practical.
- [ ] Tests cover API list query behavior and frontend list filtering behavior where the test stack supports it.

## Blocked by

- [01-fast-prospect-creation.md](./01-fast-prospect-creation.md)
- [02-customer-identity-enrichment.md](./02-customer-identity-enrichment.md)
