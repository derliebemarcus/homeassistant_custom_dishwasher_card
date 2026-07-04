# Testing

Run the complete local quality gate:

```bash
npm ci
npm test
npm run build
```

The repository tests validate behavior, syntax, packaging metadata, and parity between
source and distribution output. Jenkins additionally runs coverage, mutation testing,
SonarQube analysis, dependency checks, and security scans for non-documentation changes.
