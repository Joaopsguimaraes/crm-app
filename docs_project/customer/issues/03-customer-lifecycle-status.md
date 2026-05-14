# Customer Lifecycle Status

## What to build

Decide and implement customer lifecycle status behavior for `prospect`,
`active`, `inactive`, and `blocked`.

The user should be able to see and change customer status according to the
approved transition rules. The implementation must avoid reducing customer
lifecycle to a single `isActive` boolean.

This is HITL because allowed transitions, permissions, and unblock/reactivation
rules are not finalized.

## Acceptance criteria

- [ ] Allowed status transitions are documented before implementation.
- [ ] Customer status can be changed only through approved transitions.
- [ ] Customer status is visible on customer list and detail views.
- [ ] Invalid transitions are rejected with clear errors.
- [ ] Tests cover allowed and rejected lifecycle transitions.
- [ ] Open downstream behavior for blocked customers is documented for future modules.

## Blocked by

- [01-fast-prospect-creation.md](./01-fast-prospect-creation.md)
