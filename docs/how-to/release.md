# Release

The project uses Conventional Commits, Changesets, Jenkins, and immutable Git tags.

1. Merge releasable changes into `main` after all required checks pass.
2. Jenkins maintains the release pull request and synchronizes version sources.
3. Review and merge the release pull request.
4. The resulting version tag publishes
   `dist/homeassistant_custom_dishwasher_card.js` as the release asset.

Patch releases may be auto-merged only through the configured Jenkins release step.
Breaking changes require a major version and explicit migration notes.
