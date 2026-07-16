# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repo uses multi-context domain docs.

- `CONTEXT-MAP.md` at the repo root maps product/domain areas to their context docs.
- Context docs live under `docs/<context>/`, for example `docs/customer/domain.md`.
- System-wide ADRs live under `docs/adr/`.
- Context-specific ADRs may live under `docs/<context>/adr/`.

## Before exploring, read these

- `CONTEXT-MAP.md` at the repo root if it exists.
- The context docs relevant to the topic, such as `docs/customer/domain.md`.
- ADRs that touch the area you're about to work in.

If any of these files don't exist, proceed silently. Don't flag their absence or suggest creating them upfront.

## Use the glossary's vocabulary

When your output names a domain concept, use the term as defined in the relevant context doc. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, either reconsider the language or note the gap for domain modeling.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding.
