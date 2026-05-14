# Deletion And Historical Retention

## What to build

Decide and implement customer deletion or removal behavior in a way that
preserves commercial history.

The system must not assume hard deletion by default. The approved behavior may
be soft deletion, a status transition, restricted deletion, or a combination,
but it must be explicit before implementation.

This is HITL because deletion semantics remain open and will affect future
opportunities, budgets, sales, finance, and reports.

## Acceptance criteria

- [ ] The deletion/removal behavior is documented before implementation.
- [ ] The API applies the approved deletion/removal behavior consistently.
- [ ] Customer history is preserved according to the approved behavior.
- [ ] The frontend labels the action according to the approved behavior.
- [ ] Unsafe deletion is blocked with a clear error when required.
- [ ] Tests cover allowed removal behavior and rejected removal behavior.

## Blocked by

- [03-customer-lifecycle-status.md](./03-customer-lifecycle-status.md)
- [06-customer-addresses.md](./06-customer-addresses.md)
- [07-customer-contacts.md](./07-customer-contacts.md)
