# Design principles

- Prefer Home Assistant and Home Connect standard entities over appliance-specific IDs.
- Keep the card standalone and dependency-free at runtime.
- Degrade gracefully when optional entities or controls are unavailable.
- Preserve responsive layout, dark-mode support, and reduced-motion behavior.
- Require confirmation for disruptive actions such as stopping a programme.
- Keep source and distribution output reproducible and identical after building.
