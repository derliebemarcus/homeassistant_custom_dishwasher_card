@Library('jenkins-shared-library@main') _

ciRepositoryPipeline(
    profile: 'homeassistant-card',
    repository: [
        provider: 'forgejo',
        owner: 'siczb',
        name: 'homeassistant_custom_dishwasher_card',
    ],
    scmStatus: [
        context: 'Continuous Integration / Jenkins',
        title: 'Dishwasher Card Quality Gates',
        credentialId: 'forgejo',
        transport: 'api',
    ],
    features: [
        documentationOnly: [enabled: true],
        repositoryDocumentation: [
            enabled: true,
            validatorVersion: '1.1.1',
        ],
    ],
    profileConfig: [
        mainBranch: 'main',
        nodeJsVersion: 24,
        sourceFile: 'src/homeassistant_custom_dishwasher_card.js',
        distributionFile: 'dist/homeassistant_custom_dishwasher_card.js',
        releaseAsset: 'dist/homeassistant_custom_dishwasher_card.js',
        coverageFile: 'coverage/lcov.info',
        junitPattern: 'reports/junit/*.xml',
        coverageFloor: 81,
        reportRoot: 'reports',
        mutation: [
            artifacts: 'reports/mutation/**',
        ],
        sonar: [
            projectKey: 'homeassistant_custom_dishwasher_card',
            projectName: 'Home Assistant Custom Dishwasher Card',
            server: 'SonarQube',
            timeoutMinutes: 15,
        ],
        coveralls: [
            credentialId: 'Coveralls',
        ],
        commands: [
            actionlint: '''
                workflow_files="$(
                  find .forgejo/workflows -type f -name '*.yml' -print
                  find .forgejo/workflows -type f -name '*.yaml' -print
                )"
                test -n "$workflow_files"
                echo "$workflow_files" | while IFS= read -r workflow; do
                  podman run --rm -v "$PWD:/repo:z" -w /repo \
                    docker.io/rhysd/actionlint:latest -ignore forgejo "$workflow"
                done
            ''',
        ],
        security: [
            gitleaks: [enabled: true],
            trivy: [enabled: true],
            codeql: [
                enabled: true,
                toolName: 'codeql',
                languages: ['javascript-typescript'],
            ],
            osv: [enabled: true],
            actionlint: [enabled: true],
        ],
        repositoryChecks: [
            validateScript: 'tests/validate.mjs',
            lockfileCheck: true,
        ],
        homeAssistant: [enabled: true],
        release: [
            enabled: true,
            provider: 'forgejo',
            asset: 'dist/homeassistant_custom_dishwasher_card.js',
            versionSyncCommand: 'npm run version:sync',
            credentialId: 'forgejo',
            autoMergePatch: true,
        ],
    ],
)
