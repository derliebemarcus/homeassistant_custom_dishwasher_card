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
        security: [
            gitleaks: [enabled: true],
            trivy: [enabled: true],
            codeql: [
                enabled: true,
                toolName: 'codeql',
                languages: ['javascript-typescript', 'actions'],
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
