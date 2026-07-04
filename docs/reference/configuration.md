# Configuration

The minimum card configuration is:

```yaml
type: custom:dishwasher-card
device_id: 0123456789abcdef0123456789abcdef
```

Optional keys include `title`, `accent_color`, `show_program`, `show_delay`,
`show_options`, `program_names`, and explicit entity mappings below `entities`.

Device-based discovery is preferred. Explicit entity IDs may be supplied when Home
Connect naming or registry behavior requires an override. Unknown optional entities are
ignored without preventing the card from rendering.
