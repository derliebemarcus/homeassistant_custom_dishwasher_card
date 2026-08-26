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
    "Eco 50 °C",
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

test("prefers Home Assistant translations for program labels", () => {
  const entities = {
    activeProgram: "sensor.dishwasher_active",
    selectedProgram: "select.dishwasher_selected",
  };
  const states = {
    "sensor.dishwasher_active": entityState("dishcare_dishwasher_program_quick_65"),
    "select.dishwasher_selected": entityState("dishcare_dishwasher_program_quick_65"),
  };
  const card = createCard({ entities, states });
  card._hass.formatEntityState = (_state, value) =>
    value === "dishcare_dishwasher_program_quick_65" ? "Quick 65 °C" : value;

  assert.equal(
    card._programLabel("dishcare_dishwasher_program_quick_65"),
    "Quick 65 °C",
  );

  // An explicit mapping wins over the Home Assistant translation.
  card._config.program_names = {
    dishcare_dishwasher_program_quick_65: "Express",
  };
  assert.equal(
    card._programLabel("dishcare_dishwasher_program_quick_65"),
    "Express",
  );
});

test("maps program overrides keyed by the displayed name", () => {
  const entities = { selectedProgram: "select.dishwasher_selected" };
  const states = {
    "select.dishwasher_selected": entityState("dishcare_dishwasher_program_quick_65"),
  };
  const card = createCard({
    entities,
    states,
    config: { program_names: { "Schnell 65 °C": "Quick 65 °C" } },
  });

  assert.equal(
    card._programLabel("dishcare_dishwasher_program_quick_65"),
    "Quick 65 °C",
  );
});

test("falls back to the raw value when no translation resolves it", () => {
  const entities = { selectedProgram: "select.dishwasher_selected" };
  const states = { "select.dishwasher_selected": entityState("Schnell 65 °C") };
  const card = createCard({
    entities,
    states,
    config: { program_names: { "Schnell 65 °C": "Quick 65 °C" } },
  });
  card._hass.formatEntityState = (_state, value) => value;

  assert.equal(card._programLabel("Schnell 65 °C"), "Quick 65 °C");
  assert.equal(card._programLabel("Maschinenpflege"), "Maschinenpflege");
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
  assert.match(card.shadowRoot.innerHTML, /Eco 50 °C/);
  assert.match(card.shadowRoot.innerHTML, /Hygiene\+/);
});
