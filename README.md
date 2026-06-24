# Home Connect Dishwasher Card

A standalone Home Assistant dashboard card for Home Connect dishwashers.

![Dishwasher card preview](docs/images/card-preview.png)

## Features

- Automatic Home Connect entity discovery from a Home Assistant `device_id`
- Operation state, programme, progress, finish time, connectivity, remote-start and door status
- Programme selection, start-delay presets and dishwasher options
- Power-on and confirmed programme-stop actions
- Responsive layout with reduced-motion support
- German and English labels
- No frontend-card dependencies

## Compatibility

This card has been tested with a **Siemens iQ300 dishwasher** using the Home Connect integration. It should also work with other Home Connect dishwashers that expose the corresponding standard entities. Available controls and status fields depend on the capabilities and enabled entities of the individual appliance.

## Installation

### HACS

1. Open HACS.
2. Add this repository as a custom repository with category **Dashboard**.
3. Install **Home Connect Dishwasher Card**.
4. Reload the browser.

HACS installs the resource as:

```text
/hacsfiles/homeassistant_custom_dishwasher_card/homeassistant_custom_dishwasher_card.js
```

### Manual

Copy `dist/homeassistant_custom_dishwasher_card.js` to Home Assistant and register it as a JavaScript module.

## Configuration

```yaml
type: custom:dishwasher-card
device_id: 0123456789abcdef0123456789abcdef
title: Geschirrspüler
```

The card discovers the Home Connect entities attached to the device. Entity IDs can also be supplied explicitly:

```yaml
type: custom:dishwasher-card
title: Geschirrspüler
entities:
  operation: sensor.geschirrspuler_operation_state
  progress: sensor.geschirrspuler_program_progress
  finish: sensor.geschirrspuler_program_finish_time
  selectedProgram: select.geschirrspuler_selected_program
  door: sensor.geschirrspuler_door
  connectivity: binary_sensor.geschirrspuler_connectivity
```

Optional settings:

```yaml
type: custom:dishwasher-card
device_id: 0123456789abcdef0123456789abcdef
accent_color: var(--primary-color)
show_program: true
show_delay: true
show_options: true
program_names:
  dishcare_dishwasher_program_auto_2: Auto
```

## Requirements

- Home Assistant with the Home Connect integration configured
- The relevant entities must be enabled in the entity registry

## Development

```bash
npm ci
npm test
npm run build
```

`npm run build` validates the source and writes the HACS distribution file.

## Release process

1. Update `CHANGELOG.md` and the version in `package.json`.
2. Run the Jenkins and GitHub Actions validation pipelines.
3. Run the **Release** workflow with a semantic version such as `v0.2.0`.
4. Confirm that the HACS validation workflow passes against the release.

## Support

Use GitHub Issues for bug reports and feature requests. Security issues should follow [SECURITY.md](SECURITY.md).

## License

MIT
