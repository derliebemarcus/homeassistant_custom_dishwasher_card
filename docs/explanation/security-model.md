# Security model

The card executes in the authenticated Home Assistant frontend and inherits that user's
permissions. It does not store credentials or communicate directly with Home Connect.
All state reads and service calls pass through Home Assistant.

Configuration and logs may expose entity IDs and appliance state; support reports must
remove sensitive values. Dependencies, source, workflows, and the built artifact are
checked by the repository's Jenkins security stages.
