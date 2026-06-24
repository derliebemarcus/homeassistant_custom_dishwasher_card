# Contributing

Contributions are welcome.

## Development

1. Fork the repository and create a focused branch.
2. Install the project with `npm ci`.
3. Make changes in `src/homeassistant_custom_dishwasher_card.js`.
4. Run `npm run build` to update `dist/homeassistant_custom_dishwasher_card.js`.
5. Run `npm test`.
6. Open a pull request with a clear description and screenshots for visual changes.

Do not edit the distribution file without making the equivalent source change. CI verifies that both files are identical.

## Issues

Bug reports should include:

- Home Assistant version
- HACS/card version
- Browser and device
- Relevant entity IDs and states with sensitive values removed
- Browser console errors
- Steps to reproduce
