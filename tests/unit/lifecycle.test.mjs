import assert from "node:assert/strict";
import test from "node:test";

import { createHass, installCardDom } from "./test-helpers.mjs";

const registry = installCardDom();
await import("../../src/homeassistant_custom_dishwasher_card.js");
const DishwasherCard = registry.get("dishwasher-card");

test("validates configuration and exposes layout metadata", () => {
  const card = new DishwasherCard();

  assert.throws(
    () => card.setConfig({}),
    /dishwasher-card requires device_id or entities/,
  );
  assert.deepEqual(DishwasherCard.getStubConfig(), {
    type: "custom:dishwasher-card",
    device_id: "",
    title: "Geschirrspüler",
  });
  assert.equal(card.getCardSize(), 5);
  assert.deepEqual(card.getGridOptions(), {
    columns: 12,
    min_columns: 6,
    rows: 5,
    min_rows: 4,
  });

  card.setConfig({
    title: "Configured dishwasher",
    entities: { operation: "sensor.dishwasher_operation" },
  });
  assert.deepEqual(card._entities, {
    operation: "sensor.dishwasher_operation",
  });
  assert.equal(card._config.show_options, true);
  assert.match(card.shadowRoot.innerHTML, /Loading|Geschirrspüler wird geladen/);
});

test("discovers matching Home Connect entities and recovers from registry errors", async () => {
  const card = new DishwasherCard();
  card.setConfig({ device_id: "device-1" });
  card._hass = createHass();
  card._hass.callWS = async () => ({
    entities: [
      {
        di: "device-1",
        pl: "home_connect",
        ei: "sensor.kitchen_operation_state",
      },
      {
        device_id: "device-1",
        entity_id: "select.kitchen_selected_program",
      },
      {
        device_id: "device-1",
        platform: "home_connect",
        entity_id: "switch.kitchen_hygiene",
      },
      {
        di: "device-1",
        pl: "lg_thinq",
        ei: "sensor.ignored_program_progress",
      },
      {
        di: "other-device",
        pl: "home_connect",
        ei: "sensor.other_program_finish_time",
      },
    ],
  });

  await card._discover();

  assert.deepEqual(card._entities, {
    operation: "sensor.kitchen_operation_state",
    selectedProgram: "select.kitchen_selected_program",
    hygiene: "switch.kitchen_hygiene",
  });
  assert.equal(card._discovering, false);

  const originalError = console.error;
  const errors = [];
  console.error = (...args) => errors.push(args);
  try {
    card._hass.callWS = async () => {
      throw new Error("registry unavailable");
    };
    await card._discover();
  } finally {
    console.error = originalError;
  }

  assert.deepEqual(card._entities, {});
  assert.match(String(errors[0]?.[0]), /discovery failed/);
});

test("dispatches more-info events and isolates service-call failures", async () => {
  const card = new DishwasherCard();
  card._config = { title: "Dishwasher" };
  card._entities = { door: "sensor.dishwasher_door" };
  card._hass = createHass();

  const calls = [];
  card._hass.callService = async (...args) => calls.push(args);
  await card._service("homeassistant", "toggle", {
    entity_id: "switch.dishwasher_hygiene",
  });
  assert.deepEqual(calls, [
    [
      "homeassistant",
      "toggle",
      { entity_id: "switch.dishwasher_hygiene" },
    ],
  ]);

  card._moreInfo("door");
  assert.equal(card.lastDispatchedEvent.type, "hass-more-info");
  assert.deepEqual(card.lastDispatchedEvent.detail, {
    entityId: "sensor.dishwasher_door",
  });

  card.lastDispatchedEvent = null;
  card._moreInfo("missing");
  assert.equal(card.lastDispatchedEvent, null);

  const originalError = console.error;
  const errors = [];
  console.error = (...args) => errors.push(args);
  try {
    card._hass.callService = async () => {
      throw new Error("service unavailable");
    };
    await card._service("button", "press", {});
  } finally {
    console.error = originalError;
  }
  assert.match(String(errors[0]?.[0]), /button\.press failed/);
});
