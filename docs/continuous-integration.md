# Continuous integration

Forgejo is the canonical SCM provider for this repository. GitHub remains a push mirror only. Active repository automation is stored under `.forgejo/workflows/`; no executable workflow remains under `.github/workflows/`.

The Jenkinsfile is a declarative entry into the central `homeassistant-card` profile. The Shared Library owns checkout, lifecycle, Forgejo status publication, card quality gates, release handling, cleanup, and the final Home Assistant notification.

## Forgejo workflows

Forgejo Actions validates ticket naming and synchronizes issue status. Jenkins validates the retained Forgejo workflows with Actionlint using the Forgejo compatibility mode. CodeQL scans the JavaScript and TypeScript sources; the unsupported GitHub Actions language is not requested.

The GitHub-specific HACS Action wrapper is not executed in Forgejo. Home Assistant card and repository validation remain part of the central Jenkins profile.

## Documentation impact contract

The repository follows Repository Documentation Standard v1 with ruleset `1.1.0`. Every pull request must select exactly one outcome in the `Documentation impact` section:

- documentation was updated in the pull request; or
- there is no documentation impact, with a specific justification.

`.repository-documentation.yml` maps source, package, HACS, release, Forgejo workflow, and CI paths to the documentation that must be assessed. A mapped source change without a matching documentation change fails before project quality gates run. A no-impact declaration is rejected when a mapping is triggered.

Jenkins downloads the canonical validator from `siczb/repository-standards` release `v1.1.1`. If that source is temporarily unavailable, the tested copy embedded in `siczb/maintenance` is used without weakening the contract.

## Documentation-only shortcut

The central `ciDocumentationOnlyShortcut` classifier runs before project and release stages. When every changed path is explicitly classified as documentation, Jenkins still validates the repository contract, publishes the required `Continuous Integration / Jenkins` status, and performs central finalization. Build, test, analysis, security, packaging, release, publication, and deployment stages are skipped.

Mixed changes and unsafe comparison ranges always continue through the complete pipeline.

## Dependency maintenance

Renovate policy is defined directly in `renovate.json` so the hosted Renovate app does not need access to the private `maintenance` repository. Do not extend `local>derliebemarcus/maintenance`; mirror applicable shared base and Node.js policy changes into the local configuration instead. Repository validation prevents the inaccessible preset from being reintroduced.
