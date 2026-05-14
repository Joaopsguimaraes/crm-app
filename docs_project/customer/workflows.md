# Customer Workflows

## Fast Prospect Registration

The CRM must allow fast customer registration during prospecting.

Minimum data:

- `displayName`
- `customerType`

The system should default:

- `status`: `prospect`

The user can later complete:

- `legalName`
- document data
- email
- phone
- salesperson assignment
- addresses
- contacts

## Complete Customer Profile

A prospect can be enriched over time with more information. Completing a
profile does not require changing the entity type.

When the customer is ready for normal commercial operation, its status can move
from `prospect` to `active`.

## Block Customer

Blocked customers remain in the system for historical and reporting purposes,
but should be prevented from new commercial operations.

The exact operations blocked by `status: "blocked"` must be finalized when the
opportunity, budget, sales, and finance modules are designed.

## Inactivate Customer

Inactive customers remain available for historical records and reports.

The difference between `inactive` and `blocked` is commercial intent:

- `inactive` means the customer is no longer active.
- `blocked` means the customer is restricted from new operations.
