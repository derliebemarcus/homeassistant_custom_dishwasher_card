# 0003: Use Jenkins and Changesets for releases

## Status

Accepted

## Date

2026-07-02

## Context

The project needs reproducible validation, version synchronization, and tagged release
assets without ad hoc manual steps.

## Decision drivers

- Keep version sources synchronized.
- Block releases when quality gates fail.
- Preserve explicit release intent.

## Considered options

1. Manual versioning and tags
2. Release Please
3. Jenkins-driven Changesets release automation

## Decision

Use Jenkins and Changesets to maintain release intent, version sources, tags, and assets.

## Rationale

This integrates release behavior with the repository's existing required Jenkins checks.

## Consequences

- `.changeset/` files trigger the full pipeline and are not documentation-only.
- Release automation depends on Jenkins credentials and shared-library behavior.

## Risks

- Shared release-step regressions can affect multiple card repositories.

## References

- maintenance issue #31
- dishwasher card release migration
