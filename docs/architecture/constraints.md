# Architectural constraints

- The runtime artifact is a browser-loaded JavaScript module.
- Home Assistant 2026.6.0 is the minimum supported version.
- The card must work without another frontend-card dependency.
- Source and distribution files must remain synchronized.
- Optional Home Connect entities vary by appliance and must fail gracefully.
- Release and build metadata are not documentation-only changes.
