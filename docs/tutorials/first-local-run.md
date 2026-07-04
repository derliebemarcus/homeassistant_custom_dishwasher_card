# First local run

## Prerequisites

- Node.js 24
- npm
- a Home Assistant 2026.6.0 or newer test instance

## Procedure

1. Clone the repository.
2. Run `npm ci`.
3. Run `npm test`.
4. Run `npm run build`.
5. Copy `dist/homeassistant_custom_dishwasher_card.js` to a Home Assistant test
   instance and register it as a JavaScript module.
6. Add a `custom:dishwasher-card` using a Home Connect dishwasher `device_id`.

The source file is authoritative. The generated distribution file must match it.
