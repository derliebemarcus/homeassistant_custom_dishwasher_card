# Compatibility

- Home Assistant: 2026.6.0 or newer
- Runtime: current Home Assistant frontend browser environment
- Development and CI: Node.js 24
- Integration: Home Connect with the relevant dishwasher entities enabled

The card is verified with a Siemens iQ300 dishwasher. Other Home Connect dishwashers are
supported when they expose compatible standard entities. Current Chrome, Firefox, Edge,
and Safari releases are expected; obsolete browsers are not supported.

Dependency compatibility is maintained through npm overrides and the npm lockfile. The
development toolchain pins `qs` to `6.17.1` and resolves `fast-uri` to `3.1.9` to satisfy
the current high-severity audit gate. These internal maintenance updates require no Home
Assistant configuration changes.

Breaking configuration or entity-contract changes require a major release and migration
notes in the changelog.

CI compatibility baseline: Home Assistant Core **2026.11.0** with Node.js 24. The developer-only dependency graph uses Stryker 10.1.1 and targeted npm overrides for `qs` 6.17.1 and `minimatch` 11.0.5. Security exemptions are not used for the npm/OSV findings addressed by this change.
