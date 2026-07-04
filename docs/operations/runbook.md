# Runbook

## Routine maintenance

1. Review dependency and Home Assistant compatibility updates.
2. Run `npm ci`, `npm test`, and `npm run build`.
3. Verify the card against a Home Connect dishwasher in a test dashboard.
4. Merge only after required Jenkins and GitHub checks pass.
5. Release through the Jenkins and Changesets workflow.

## Incident response

For a broken release, stop further release automation, identify the last known-good tag,
apply the rollback procedure, and document the cause and corrective action.
