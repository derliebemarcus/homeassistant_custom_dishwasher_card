# Configuration

The minimum card configuration is:

```yaml
type: custom:dishwasher-card
device_id: 0123456789abcdef0123456789abcdef
```

Optional keys include `title`, `accent_color`, `show_program`, `show_delay`,
`show_options`, `show_maintenance`, `program_names`, and explicit entity mappings
below `entities`.

`show_maintenance` defaults to `false` so existing dashboards keep the same layout.
When enabled, the card can display Home Connect Local salt, rinse-aid, Machine Care,
filter, and descaling status entities when those entities are available.

Home Connect Local (`homeconnect_ws`) is supported by device discovery in addition to
the built-in Home Connect integration. Current Home Connect Local program identifiers
such as `dishcare_dishwasher_program_eco50` and the older underscored identifiers are
both mapped to readable English names.

Device-based discovery is preferred. Explicit entity IDs may be supplied when Home
Connect naming or registry behavior requires an override. Unknown optional entities are
ignored without preventing the card from rendering.
