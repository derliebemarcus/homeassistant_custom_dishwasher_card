# Continuous integration

The Jenkins pipeline uses the shared `ciDocumentationOnlyShortcut` classifier before any project or release stage.

When every changed path is explicitly classified as documentation, Jenkins publishes the normal required `Continuous Integration / Jenkins` status and exits before build, test, analysis, security, packaging, release, publication, or deployment work begins.

No stage-specific checks or Home Assistant notifications are emitted for this path.

Mixed changes and unsafe comparison ranges always continue through the complete pipeline.
