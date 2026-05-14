# Duplicate Detection

## What to build

Decide and implement duplicate detection for customer identity data.

The first candidate rule is uniqueness of `documentType + documentNumber` when
both fields are present. Additional duplicate signals such as normalized
display name, email, or phone need an explicit product decision before
implementation.

This is HITL because duplicate behavior was the next unresolved domain question.

## Acceptance criteria

- [ ] Duplicate detection rules are documented before implementation.
- [ ] The API enforces or warns about duplicates according to the approved behavior.
- [ ] The frontend clearly communicates duplicate conflicts or warnings.
- [ ] Prospect creation without document data remains possible.
- [ ] Tests cover duplicate document behavior.
- [ ] Tests cover the approved behavior for any additional duplicate signals.

## Blocked by

- [02-customer-identity-enrichment.md](./02-customer-identity-enrichment.md)
