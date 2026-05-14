# Fast Prospect Creation

## What to build

Build the first customer-module tracer bullet: a user can create a customer
prospect with only the minimum useful data and immediately see the saved record
in the application.

The customer must require `displayName` and `customerType`, default to
`status: prospect`, and not require legal name, document data, email, phone,
addresses, contacts, or salesperson assignment.

This slice should establish the shared customer contracts, persistence model,
API endpoint, frontend creation flow, and first testing baseline for the
customer module.

## Acceptance criteria

- [ ] A customer can be created with only `displayName` and `customerType`.
- [ ] A newly created customer defaults to `status: prospect`.
- [ ] Empty `displayName` is rejected with a clear validation error.
- [ ] Missing or invalid `customerType` is rejected with a clear validation error.
- [ ] The created customer is persisted and can be read back through the API.
- [ ] The frontend provides a fast prospect creation flow.
- [ ] Shared contracts exist where both frontend and backend need the same customer shape.
- [ ] Tests cover successful minimum customer creation and validation failures.

## Blocked by

None - can start immediately.
