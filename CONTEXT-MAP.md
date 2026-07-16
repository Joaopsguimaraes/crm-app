# Context Map

This file maps CRM domain contexts to their canonical documentation.

## How to use this map

Before changing behavior in a domain, read the relevant context docs listed
here. Domain docs define business language, boundaries, rules, and decisions.
They are not API, database, or UI specifications.

## Contexts

### Customer

`Customer` is the central commercial identity from the first contact. It can
represent a company or individual and may exist before sales, finance,
opportunities, or complete fiscal/legal data.

Read first:

- `docs/customer/domain.md`

Related code:

- `apps/api/src/customers/`
- `apps/web/src/features/customers/`
- `apps/web/src/app/customers/`

### Pipeline

`Pipeline` will own commercial maturity and negotiation flow, such as lead,
prospect, stages, won/lost state, and opportunity movement.

Read first:

- To be defined.

Related code:

- To be defined.

### Sales

`Sales` will own commercial operations such as quotes, orders, sale lifecycle,
and rules for moving a commercial opportunity into a committed sale.

Read first:

- To be defined.

Related code:

- To be defined.

### Finance

`Finance` will own billing, receivables, payment tracking, financial
constraints, and finance-specific requirements before operations proceed.

Read first:

- To be defined.

Related code:

- To be defined.

### Management

`Management` will own operational visibility, administrative workflows,
reporting, and cross-domain coordination views.

Read first:

- To be defined.

Related code:

- To be defined.

## System-wide decisions

System-wide ADRs live under:

- `docs/adr/`

Context-specific ADRs may live under:

- `docs/<context>/adr/`
