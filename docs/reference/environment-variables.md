# Environment variables

The browser card has no runtime environment variables. Home Assistant provides runtime
state and services through the frontend card API.

Build and CI behavior is configured through `package.json`, Jenkins parameters, and
credentials managed outside the repository. Secrets must never be embedded in source,
configuration examples, or the generated distribution file.
