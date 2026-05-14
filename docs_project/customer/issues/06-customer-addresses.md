# Customer Addresses

## What to build

Add customer-owned address management as a nested customer resource.

Users should be able to add, list, update, and delete many addresses for a
customer. Each address must have an address type of `main`, `billing`, or
`other`. A customer can have at most one `main` address.

## Acceptance criteria

- [ ] A customer can have many addresses.
- [ ] Address type supports `main`, `billing`, and `other`.
- [ ] Address creation requires `addressLine`.
- [ ] Address fields such as number, neighborhood, address line 2, and city are optional.
- [ ] The system prevents more than one `main` address for the same customer.
- [ ] Users can add, edit, list, and delete addresses from the customer detail flow.
- [ ] Tests cover nested address API behavior and the single-main-address rule.

## Blocked by

- [05-customer-detail-screen.md](./05-customer-detail-screen.md)
