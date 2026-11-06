import assert from "node:assert/strict";
import test from "node:test";

import {
  createHass,
  entityState,
  installCardDom,
} from "./test-helpers.mjs";

const registry = installCardDom();
await import("../../src/homeassistant_custom_dishwasher_card.js");
const DishwasherCard = registry.get("dishwasher-card");

function createCard({
  language = "de",
  entities = {},
  states = {},
  config = {},
} = {}) {
  const card = new DishwasherCard();
  card._config = {
    title: "Geschirrspüler",
    show_program: true,
    show_delay: true,
    show_options: true,
    ...config,
  };
  card._entities = entities;
  card._hass = createHass(states, language);
  return card;
}

test("selects German and English labels", () => {
  assert.equal(createCard({ language: "de-DE" })._language, "de");
  assert.equal(createCard({ language: "en-US" })._text.progress, "Progress");
});

test("tracks state availability and running operation states", () => {
  const entities = {
    operation: "sensor.dishwasher_operation",
    connectivity: "binary_sensor.dishwasher_connectivity",
  };
  const states = {
    "sensor.dishwasher_operation": entityState("run"),
    "binary_sensor.dishwasher_connectivity": entityState("on"),
  };
  const card = createCard({ entities, states });

  assert.equal(card._available("operation"), true);
  assert.equal(card._on("connectivity"), true);
  assert.equal(card._operation(), "run");
  assert.equal(card._running(), true);

  for (const state of ["pause", "delayedstart", "aborting"]) {
    card._hass.states["sensor.dishwasher_operation"] = entityState(state);
    assert.equal(card._running(), true);
  }

  card._hass.states["sensor.dishwasher_operation"] = entityState("ready");
  assert.equal(card._running(), false);
  card._hass.states["sensor.dishwasher_operation"] = entityState("unknown");
  assert.equal(card._available("operation"), false);
});

test("clamps progress and rejects non-numeric values", () => {
  const entities = { progress: "sensor.dishwasher_progress" };
  const card = createCard({
    entities,
    states: { "sensor.dishwasher_progress": entityState("125") },
  });

  assert.equal(card._progress(), 100);
  card._hass.states["sensor.dishwasher_progress"] = entityState("-5");
  assert.equal(card._progress(), 0);
  card._hass.states["sensor.dishwasher_progress"] = entityState("unknown");
  assert.equal(card._progress(), null);
});

test("prefers an active program and formats program labels", () => {
  const entities = {
    activeProgram: "sensor.dishwasher_active",
    selectedProgram: "select.dishwasher_selected",
  };
  const states = {
    "sensor.dishwasher_active": entityState(
      "dishcare_dishwasher_program_eco_50",
    ),
    "select.dishwasher_selected": entityState(
      "dishcare_dishwasher_program_auto_2",
    ),
  };
  const card = createCard({ entities, states });

  assert.equal(card._program(), "dishcare_dishwasher_program_eco_50");
  assert.equal(
    card._programLabel("dishcare_dishwasher_program_eco_50"),
    "Eco 50°",
  );

  card._hass.states["sensor.dishwasher_active"] = entityState("none");
  assert.equal(card._program(), "dishcare_dishwasher_program_auto_2");

  card._config.program_names = { custom_program: "Custom program" };
  assert.equal(card._programLabel("custom_program"), "Custom program");
  assert.equal(card._programLabel("dishcare_dishwasher_program_super_hot"), "super hot");
  assert.equal(card._programLabel(""), "Kein Programm gewählt");

  card._hass.states["select.dishwasher_selected"] = entityState("unavailable");
  assert.equal(card._program(), "");
});

test("formats valid finish times and rejects invalid values", () => {
  const entities = { finish: "sensor.dishwasher_finish" };
  const card = createCard({
    entities,
    states: {
      "sensor.dishwasher_finish": entityState("2026-06-25T18:30:00Z"),
    },
  });

  assert.match(card._finish(), /^\d{2}:\d{2}$/);

  for (const value of ["none", "unknown", "invalid-date"]) {
    card._hass.states["sensor.dishwasher_finish"] = entityState(value);
    assert.equal(card._finish(), "");
  }
});

test("maps door states and escapes HTML", () => {
  const entities = { door: "sensor.dishwasher_door" };
  const card = createCard({
    entities,
    states: { "sensor.dishwasher_door": entityState("open") },
  });

  assert.deepEqual(card._door(), {
    label: "Tür offen",
    icon: "mdi:door-open",
    tone: "warning",
  });

  card._hass.states["sensor.dishwasher_door"] = entityState("locked");
  assert.equal(card._door().tone, "good");

  card._hass.states["sensor.dishwasher_door"] = entityState("closed");
  assert.equal(card._door().tone, "muted");

  assert.equal(card._escape(`<>&"'`), "&lt;&gt;&amp;&quot;&#039;");
});

test("creates a state signature including select options", () => {
  const entities = { selectedProgram: "select.dishwasher_selected" };
  const card = createCard({
    entities,
    states: {
      "select.dishwasher_selected": entityState("eco", {
        options: ["eco", "auto"],
      }),
    },
  });

  assert.equal(
    card._stateSignature(),
    JSON.stringify({ selectedProgram: ["eco", ["eco", "auto"]] }),
  );
});

test("renders loading, missing and populated card states", () => {
  const card = new DishwasherCard();
  card._config = {
    title: "Test dishwasher",
    show_program: true,
    show_delay: true,
    show_options: true,
  };

  card._render();
  assert.match(card.shadowRoot.innerHTML, /Geschirrspüler wird geladen/);

  card._hass = createHass({}, "de");
  card._entities = {};
  card._render();
  assert.match(card.shadowRoot.innerHTML, /Keine Home-Connect-Entitäten gefunden/);

  card._entities = {
    connectivity: "binary_sensor.dishwasher_connectivity",
    remoteStart: "switch.dishwasher_remote",
    door: "sensor.dishwasher_door",
    operation: "sensor.dishwasher_operation",
    progress: "sensor.dishwasher_progress",
    activeProgram: "sensor.dishwasher_active",
    selectedProgram: "select.dishwasher_selected",
    delay: "number.dishwasher_delay",
    hygiene: "switch.dishwasher_hygiene",
    stop: "button.dishwasher_stop",
  };
  card._hass = createHass({
    "binary_sensor.dishwasher_connectivity": entityState("on"),
    "switch.dishwasher_remote": entityState("on"),
    "sensor.dishwasher_door": entityState("closed"),
    "sensor.dishwasher_operation": entityState("run"),
    "sensor.dishwasher_progress": entityState("55"),
    "sensor.dishwasher_active": entityState(
      "dishcare_dishwasher_program_eco_50",
    ),
    "select.dishwasher_selected": entityState(
      "dishcare_dishwasher_program_eco_50",
      { options: ["dishcare_dishwasher_program_eco_50"] },
    ),
    "number.dishwasher_delay": entityState("0"),
    "switch.dishwasher_hygiene": entityState("on"),
    "button.dishwasher_stop": entityState("unknown"),
  });
  card._render();

  assert.match(card.shadowRoot.innerHTML, /Test dishwasher/);
  assert.match(card.shadowRoot.innerHTML, /55%/);
  assert.match(card.shadowRoot.innerHTML, /Eco 50°/);
  assert.match(card.shadowRoot.innerHTML, /Hygiene\+/);
});


test("supports current Home Connect Local program identifiers", () => {
  const card = createCard({ language: "en-US" });

  assert.equal(card._programLabel("favorite_001"), "Favorite");
  assert.equal(card._programLabel("dishcare_dishwasher_program_auto2"), "Auto");
  assert.equal(card._programLabel("dishcare_dishwasher_program_eco50"), "Eco 50°");
  assert.equal(card._programLabel("dishcare_dishwasher_program_intensiv70"), "Intensive 70°");
  assert.equal(card._programLabel("dishcare_dishwasher_program_machinecare"), "Machine Care");
  assert.equal(card._programLabel("dishcare_dishwasher_program_prerinse"), "Pre Rinse");
  assert.equal(card._programLabel("dishcare_dishwasher_program_quick65"), "Quick 65°");
});

test("normalizes binary door states from Home Connect Local", () => {
  const entities = { door: "binary_sensor.dishwasher_door" };
  const card = createCard({
    language: "en-US",
    entities,
    states: { "binary_sensor.dishwasher_door": entityState("on") },
  });

  assert.equal(card._door().label, "Door open");
  card._hass.states["binary_sensor.dishwasher_door"] = entityState("off");
  assert.equal(card._door().label, "Door closed");
});

test("formats remaining time and calculates a finish fallback", () => {
  const entities = { remainingTime: "sensor.dishwasher_remaining_program_time" };
  const card = createCard({
    language: "en-US",
    entities,
    states: {
      "sensor.dishwasher_remaining_program_time": entityState("3.75", {
        unit_of_measurement: "h",
      }),
    },
  });

  assert.equal(card._remaining(), "3 h 45 min");
  assert.match(card._finish(), /^\d{2}:\d{2}$/);

  card._hass.states["sensor.dishwasher_remaining_program_time"] = entityState("13500", {
    unit_of_measurement: "s",
  });
  assert.equal(card._remaining(), "3 h 45 min");
});

test("renders Home Connect Local maintenance statuses only when enabled", () => {
  const entities = {
    salt: "sensor.dishwasher_salt",
    rinseAid: "sensor.dishwasher_rinse_aid",
    smartFilter: "binary_sensor.dishwasher_smart_filter_cleaning",
    machineCareRemainingRuns: "sensor.dishwasher_machinecare_remaining_runs",
  };
  const states = {
    "sensor.dishwasher_salt": entityState("nearly_empty"),
    "sensor.dishwasher_rinse_aid": entityState("full"),
    "binary_sensor.dishwasher_smart_filter_cleaning": entityState("on"),
    "sensor.dishwasher_machinecare_remaining_runs": entityState("28"),
  };

  const hidden = createCard({ language: "en-US", entities, states });
  assert.equal(hidden._maintenance(), "");

  const card = createCard({
    language: "en-US",
    entities,
    states,
    config: { show_maintenance: true },
  });
  const html = card._maintenance();
  assert.match(html, /Maintenance/);
  assert.match(html, /Refill soon/);
  assert.match(html, /Clean filter/);
  assert.match(html, />28</);
});

test("includes Extra Dry in program option controls", () => {
  const entities = { extraDry: "switch.dishwasher_extra_dry_option" };
  const states = { "switch.dishwasher_extra_dry_option": entityState("on") };
  const card = createCard({ language: "en-US", entities, states });

  assert.match(card._optionControls(), /Extra Dry/);
  assert.match(card._optionControls(), /active/);
});
