# Troubleshooting

## Card is not displayed

Confirm that the JavaScript module URL is registered and reload the browser cache.

## Entities are missing

Verify the Home Connect integration, enable relevant entities, and confirm the configured
`device_id`. Use explicit entity mappings when discovery cannot identify an entity.

## Controls are unavailable

Home Connect capability, appliance state, remote-start settings, or permissions may
prevent a service action. Check the corresponding entities in Home Assistant Developer
Tools.

## Upgrade appears ineffective

Remove stale browser cache and verify that Home Assistant serves the expected release
asset version.
