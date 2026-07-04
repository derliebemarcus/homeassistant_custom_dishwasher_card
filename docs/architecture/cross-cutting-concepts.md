# Cross-cutting concepts

## Configuration

YAML configuration is normalized once and explicit entity mappings override discovery.

## Authentication and authorization

Home Assistant controls the authenticated session and service permissions.

## Logging and errors

Missing optional entities degrade the corresponding feature. Invalid required
configuration produces an actionable card error instead of an unhandled exception.

## Localization and accessibility

German and English labels, responsive layout, dark mode, semantic controls, and reduced
motion are treated as cross-cutting quality concerns.
