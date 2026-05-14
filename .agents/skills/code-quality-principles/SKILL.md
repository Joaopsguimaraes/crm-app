---
name: code-quality-principles
description: Engineering quality guardrails for this CRM project. Use when creating, changing, reviewing, or refactoring code in the frontend or API packages, especially functions, classes, helpers, services, use cases, repositories, controllers, components, hooks, utilities, tests, and shared abstractions. Apply SOLID, Clean Code, YAGNI, KISS, DRY, low coupling, high cohesion, explicit boundaries, and validated project conventions before implementation and during review.
---

# Code Quality Principles

## Core Workflow

Use this skill before designing or editing application code.

1. Read nearby code first and follow the package's existing architecture, naming, test style, and dependency boundaries.
2. Identify the smallest behavior change that satisfies the request.
3. Choose the simplest design that keeps the code easy to test, extend, and delete.
4. Implement with clear names, explicit inputs and outputs, and localized side effects.
5. Validate with focused tests or checks appropriate to the changed surface.
6. Review the diff against the checklist below before finishing.

## Standards

Apply these principles as practical constraints, not slogans:

- `KISS`: prefer direct code over clever abstractions, hidden control flow, or generic frameworks.
- `YAGNI`: do not add extension points, config, patterns, layers, or parameters until current requirements need them.
- `DRY`: remove meaningful duplication in behavior or knowledge; tolerate small local duplication when abstraction would obscure intent.
- `SOLID`: keep modules focused, dependencies pointing inward toward stable contracts, and behavior open to extension through existing seams rather than condition-heavy edits.
- `Clean Code`: use precise names, short functions with one level of abstraction, low argument counts, early returns for guards, and errors that explain the failing domain condition.
- `Low coupling`: avoid importing across package boundaries or architectural layers unless the repo already defines that relationship.
- `High cohesion`: keep domain rules close to the use case/service that owns them, not scattered through UI, controllers, or generic helpers.

## Frontend Guidance

For React and frontend package work:

- Keep components focused on rendering and interaction orchestration.
- Extract hooks only when they own reusable stateful behavior, not just to reduce line count.
- Keep domain transformations outside JSX when they become non-trivial.
- Prefer typed props and explicit event handlers over shape guessing or implicit `any`.
- Preserve accessibility, loading, empty, and error states when changing user-facing flows.
- Avoid global state unless the state is genuinely shared across distant parts of the app.

## API Guidance

For API package work:

- Keep controllers/adapters thin; put business rules in use cases or services according to the existing package pattern.
- Keep validation at the boundary, then pass typed, normalized data inward.
- Make persistence concerns explicit in repositories or data access modules.
- Do not leak ORM/database shapes into domain or response contracts unless the existing architecture intentionally does so.
- Model domain errors deliberately and convert them to transport responses at the edge.
- Keep transactions, authorization, and side effects visible at the use-case level when they affect correctness.

## Function And Abstraction Checklist

Before adding a function, class, helper, service, use case, or utility, check:

- Does this name describe the business intent or technical responsibility precisely?
- Is the input already validated or should this boundary validate it?
- Is the output explicit and typed?
- Can this be tested without unrelated infrastructure?
- Is the abstraction called from multiple places, or does it clarify a complex concept?
- Would inlining be clearer?
- Does this introduce a dependency direction that the package already permits?
- Are errors and edge cases handled where the caller can act on them?

## Review Triggers

Pause and simplify when a change adds:

- A generic helper with only one caller.
- Boolean parameters that switch major behavior.
- A class with no state or polymorphic need.
- A service that mostly forwards calls.
- A hook or component that mixes fetching, formatting, permissions, and rendering.
- A use case that depends directly on UI, HTTP, ORM, or framework-specific objects without an established local pattern.
- Tests that only mock implementation details and do not assert observable behavior.

## Validation

Run the narrowest reliable validation available for the changed package. Prefer existing scripts and nearby tests. If validation cannot run, state the reason and describe the residual risk.
