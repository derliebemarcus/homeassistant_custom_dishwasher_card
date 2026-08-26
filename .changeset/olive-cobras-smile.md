---
"homeassistant_custom_dishwasher_card": minor
---

Translate programme names through Home Assistant instead of a hard-coded German list.
The card now formats the programme entity state with the frontend's own Home Connect
translations, adds a `language` option to pin the card labels to `de` or `en`, and lets
`program_names` be keyed by the raw state or by the displayed name.
