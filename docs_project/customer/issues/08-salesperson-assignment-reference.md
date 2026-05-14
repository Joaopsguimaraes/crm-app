# Salesperson Assignment Reference

## What to build

Decide and implement optional salesperson assignment on customers by reference.

The customer module should reference an external salesperson identifier without
owning salesperson data. The UI should expose assignment only to the extent that
the salesperson module or placeholder source of valid salespeople exists.

This is HITL because the salesperson module does not exist yet and assignment
requirements are still open.

## Acceptance criteria

- [ ] The source of valid salesperson identifiers is decided before implementation.
- [ ] Customer records can store an optional salesperson reference.
- [ ] Customer APIs expose salesperson assignment without duplicating salesperson data.
- [ ] The frontend can show and update salesperson assignment when a valid source exists.
- [ ] Tests cover assigning, changing, and clearing salesperson assignment.
- [ ] Any unresolved salesperson ownership history requirements remain documented.

## Blocked by

- [01-fast-prospect-creation.md](./01-fast-prospect-creation.md)
- [05-customer-detail-screen.md](./05-customer-detail-screen.md)
