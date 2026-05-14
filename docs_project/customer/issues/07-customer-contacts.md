# Customer Contacts

## What to build

Add customer-owned contact management as a nested customer resource.

Users should be able to add, list, update, and delete many contacts for a
customer. Contacts should require only a name and may include optional document
data, email, phone, address, and active state. Contact role/type is intentionally
out of scope for this first version.

## Acceptance criteria

- [ ] A customer can have many contacts.
- [ ] Contact creation requires `name`.
- [ ] Contact email, phone, address, document type, and document number are optional.
- [ ] Contact `isActive` defaults to `true`.
- [ ] Contact role/type is not required and is not added in this slice.
- [ ] Users can add, edit, list, and delete contacts from the customer detail flow.
- [ ] Tests cover nested contact API behavior and confirm role/type is not required.

## Blocked by

- [05-customer-detail-screen.md](./05-customer-detail-screen.md)
