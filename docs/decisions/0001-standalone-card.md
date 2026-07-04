# 0001: Keep the card standalone

## Status

Accepted

## Date

2026-06-24

## Context

The card must be easy to install and reliable across Home Assistant dashboards.

## Decision drivers

- Minimize runtime compatibility risks.
- Avoid requiring users to install another custom card.
- Keep release assets self-contained.

## Considered options

1. Depend on a general-purpose frontend card library
2. Bundle third-party runtime dependencies
3. Implement a standalone browser module

## Decision

Implement and publish the card as a standalone JavaScript module.

## Rationale

A standalone module minimizes installation steps and external compatibility coupling.

## Consequences

- UI primitives are maintained in this repository.
- The release artifact is larger than a thin integration layer.

## Risks

- Duplicated frontend patterns require local maintenance.

## References

- Initial repository implementation
