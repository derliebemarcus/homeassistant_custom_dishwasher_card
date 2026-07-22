# Compatibility

- Home Assistant: 2026.6.0 or newer
- Runtime: current Home Assistant frontend browser environment
- Development and CI: Node.js 24
- Integration: Home Connect with the relevant dishwasher entities enabled

The card is verified with a Siemens iQ300 dishwasher. Other Home Connect dishwashers are
supported when they expose compatible standard entities. Current Chrome, Firefox, Edge,
and Safari releases are expected; obsolete browsers are not supported.

Dependency compatibility is maintained through npm overrides and the npm lockfile. The
development toolchain pins `qs` to `6.15.3` and resolves `fast-uri` to `3.1.4` to satisfy
the current high-severity audit gate. These internal maintenance updates require no Home
Assistant configuration changes.

Breaking configuration or entity-contract changes require a major release and migration
notes in the changelog.
