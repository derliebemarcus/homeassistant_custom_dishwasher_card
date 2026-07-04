# 0000: Use MADR for architecture decisions

## Status

Accepted

## Date

2026-07-03

## Context

The repository needs durable records for decisions that affect compatibility, release,
and architecture.

## Decision drivers

- Preserve rationale beyond implementation details.
- Link decisions to issues and pull requests.
- Keep accepted history immutable.

## Considered options

1. Informal notes
2. Custom decision documents
3. MADR-compatible ADRs

## Decision

Use MADR-compatible ADRs below `docs/decisions/`.

## Rationale

MADR is compact, reviewable, and captures alternatives and consequences.

## Consequences

- Major decisions require an ADR.
- Changed decisions create a superseding ADR.

## Risks

- Minor decisions may be over-documented; apply proportionality.

## References

- maintenance issue #37
