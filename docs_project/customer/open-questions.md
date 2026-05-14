# Customer Open Questions

These questions still need decisions before implementation.

## Lifecycle and Deletion

- Should deleting a customer be forbidden when related records exist?
- Should customer deletion be soft delete, status transition, or both?
- Can users reactivate `inactive` customers?
- Can users unblock `blocked` customers, and who is allowed to do that?

## Duplicate Detection

- Should `documentType + documentNumber` be unique?
- Should duplicate detection include normalized `displayName`, email, or phone?
- Should duplicates warn the user or block creation?

## Contact Behavior

- Should inactive contacts be hidden by default?
- Should contacts support document validation in the same way as customers?
- When should contact role/type be introduced?

## Address Behavior

- Can a customer have zero addresses forever?
- If the only `main` address is deleted, should another address become main?
- Can a customer have multiple `billing` addresses?

## Salesperson Assignment

- Is `salespersonId` required when the customer becomes `active`?
- Can customer ownership change between salespeople?
- Should salesperson history be tracked?

## Search and List UX

- Which columns are mandatory in the customer list?
- Which filters must be URL-driven?
- Should list search include contacts and addresses?
