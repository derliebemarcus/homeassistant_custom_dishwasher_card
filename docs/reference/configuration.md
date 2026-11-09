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

## Starting a wash

Program selection updates **Selected program** only. Once powered on, **Start program**
sends that selected option to **Active program**, which starts the wash through the
Home Connect integration. Power on does not start a wash automatically.

Start requires ready/finished operation, enabled remote start, a reported closed/locked
door, and the selected raw option in both selects' options. A mapped connectivity or
power entity must report on. An idle Active program can report unknown/none; its
options still determine support. If a prerequisite is missing, Start is disabled with
an explanation. Explicit mappings use `entities.selectedProgram` and
`entities.activeProgram` with the corresponding `select.*` entities.

While selecting, wait for both the service response and the reported selection before
starting. While starting, the controls show progress until the matching active program
and running/scheduled operation are reported, even if the service response is still
pending. The card times out after 35 seconds without retrying. Check the appliance
state before trying again after a timeout. Config changes and disconnects end
observation; they cannot undo a command already sent.
