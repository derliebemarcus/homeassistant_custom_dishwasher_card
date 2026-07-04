# Local development

## Setup

Run `npm ci` with Node.js 24. Implement changes in
`src/homeassistant_custom_dishwasher_card.js`; do not edit the distribution artifact
without making the corresponding source change.

## Development loop

1. Change the source and tests.
2. Run `npm test`.
3. Run `npm run build`.
4. Load the generated file in a Home Assistant test instance.
5. Verify desktop, mobile, dark-mode, and reduced-motion behavior.

See [testing](testing.md) and the [repository structure](../reference/repository-structure.md).
