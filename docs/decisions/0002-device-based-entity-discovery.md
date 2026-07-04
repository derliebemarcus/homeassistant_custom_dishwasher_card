# 0002: Prefer device-based entity discovery

## Status

Accepted

## Date

2026-06-24

## Context

Home Connect exposes several entities per appliance and entity IDs differ by installation.

## Decision drivers

- Keep configuration concise.
- Support user-renamed entities.
- Permit deterministic overrides.

## Considered options

1. Require every entity ID
2. Infer entities by naming convention
3. Discover entities from a Home Assistant device ID with explicit overrides

## Decision

Prefer `device_id` discovery and allow explicit entity mappings as overrides.

## Rationale

The device registry is more stable than installation-specific entity names while
preserving an escape hatch for unusual setups.

## Consequences

- Discovery logic must tolerate missing optional entities.
- Explicit mappings remain part of the public configuration contract.

## Risks

- Home Assistant registry changes may require discovery updates.

## References

- Configuration reference
