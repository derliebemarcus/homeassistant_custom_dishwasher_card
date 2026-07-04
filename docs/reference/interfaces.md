# Interfaces

## Home Assistant frontend

The card implements the Lovelace custom-card interface, receives the Home Assistant
object, renders entity state, and calls Home Assistant services for supported controls.

## Configuration

The public configuration interface is the YAML card configuration documented in
[configuration](configuration.md).

## Distribution

HACS and manual installations consume
`dist/homeassistant_custom_dishwasher_card.js` as a JavaScript module.
