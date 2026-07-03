@Library('jenkins-shared-library@feature/37-documentation-only-short-circuit') _

if (ciDocumentationOnlyShortcut(
    scm: scm,
    agentLabel: 'klymene',
    repository: [
        owner: 'derliebemarcus',
        name: 'homeassistant_custom_dishwasher_card',
    ],
    github: [
        credentialId: 'github token',
        statusContext: 'Continuous Integration / Jenkins',
        title: 'Dishwasher Card Quality Gates',
    ],
)) {
    return
}

ciHomeAssistantCard(
    scm: scm,
    agentLabel: 'klymene',
    mainBranch: 'main',
    repository: [
        owner: 'derliebemarcus',
        name: 'homeassistant_custom_dishwasher_card',
    ],
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
    github: [
        credentialId: 'github token',
        publishStageChecks: true,
        publishFinalCheck: false,
        statusContext: 'Continuous Integration / Jenkins',
        title: 'Dishwasher Card Quality Gates',
    ],
    homeAssistant: [
        enabled: true,
    ],
)

ciChangesetsRelease(
    scm: scm,
    agentLabel: 'klymene',
    mainBranch: 'main',
    repository: [
        owner: 'derliebemarcus',
        name: 'homeassistant_custom_dishwasher_card',
    ],
    asset: 'dist/homeassistant_custom_dishwasher_card.js',
    versionSyncCommand: 'npm run version:sync',
    credentialId: 'github token',
    autoMergePatch: true,
)
