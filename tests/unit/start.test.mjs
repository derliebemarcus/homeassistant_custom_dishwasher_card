import assert from "node:assert/strict";
import test from "node:test";
import { createHass, entityState, installCardDom } from "./test-helpers.mjs";

const registry = installCardDom();
await import("../../src/homeassistant_custom_dishwasher_card.js");
const DishwasherCard = registry.get("dishwasher-card");
const eco = "dishcare_dishwasher_program_eco_50";
const quick = "dishcare_dishwasher_program_quick_45";

function fixture() {
  const card = new DishwasherCard();
  const entities = {
    connectivity: "binary_sensor.sample_connectivity", power: "switch.sample_power",
    remoteStart: "binary_sensor.sample_remote_start", door: "sensor.sample_door",
    operation: "sensor.sample_operation_state", selectedProgram: "select.sample_selected_program",
    activeProgram: "select.sample_active_program", stop: "button.sample_stop_program",
  };
  const states = Object.fromEntries(Object.entries({
    connectivity: "on", power: "on", remoteStart: "on", door: "closed",
    operation: "ready", selectedProgram: eco, activeProgram: "unknown", stop: "unknown",
  }).map(([key, value]) => [entities[key], entityState(value, key.endsWith("Program") ? { options: [eco, quick] } : {})]));
  const hass = createHass(states, "en"), calls = [];
  hass.callService = async (...args) => { calls.push(args); };
  card.setConfig({ entities, title: "Dishwasher" }); card.hass = hass;
  const report = (key, value) => {
    hass.states[entities[key]] = { ...hass.states[entities[key]], state: value };
    card.hass = { ...hass };
  };
  return { card, entities, hass, calls, report };
}

test("power-on is replaced by an enabled explicit Start, without sending a wash command", async () => {
  const f = fixture(); f.report("power", "off");
  assert.match(f.card._actions(), /data-action="power"/);
  assert.doesNotMatch(f.card._actions(), /data-action="start"/);
  await f.card._service("switch", "turn_on", { entity_id: f.entities.power });
  f.report("power", "on");
  assert.doesNotMatch(f.card._actions(), /data-action="power"/);
  assert.match(f.card._actions(), /data-action="start"/);
  assert.equal(f.card._startReason(), "");
  assert.deepEqual(f.calls, [["switch", "turn_on", { entity_id: f.entities.power }]]);
});

test("Start revalidates prerequisites and rejects malformed or unsupported controls without writes", () => {
  const cases = [
    ["connectivity", "off"], ["connectivity", "unavailable"], ["power", "off"], ["power", "unknown"],
    ["remoteStart", "off"], ["remoteStart", "unavailable"], ["door", "open"], ["door", "unknown"],
    ...["inactive", "run", "pause", "delayedstart", "aborting", "error", "unknown"].map(s => ["operation", s]),
    ["selectedProgram", "unavailable"], ["selectedProgram", "not_supported"], ["activeProgram", "unavailable"],
  ];
  for (const [key, value] of cases) {
    const f = fixture(); f.report(key, value);
    assert.ok(f.card._startReason(), `${key}/${value}`); f.card._startProgram();
    assert.equal(f.calls.length, 0, `${key}/${value}`);
  }
  for (const change of [
    f => { delete f.card._entities.activeProgram; },
    f => { f.card._entities.activeProgram = "sensor.read_only_program"; },
    f => { f.card._entities.selectedProgram = "sensor.read_only_program"; },
    f => { f.hass.states[f.entities.activeProgram].attributes.options = [quick]; },
    f => { f.hass.states[f.entities.activeProgram].attributes.options = eco; },
    f => { f.hass.states[f.entities.selectedProgram].attributes.options = undefined; },
  ]) {
    const f = fixture(); change(f); f.card._startProgram(); assert.equal(f.calls.length, 0);
  }
});

test("Start sends the selected raw program once and waits for reported operation and active program", async () => {
  const f = fixture(); f.report("door", "locked");
  f.card._startProgram(); f.card._startProgram();
  assert.deepEqual(f.calls, [["select", "select_option", { entity_id: f.entities.activeProgram, option: eco }]]);
  assert.match(f.card._actions(), /disabled aria-busy="true"/);
  await Promise.resolve(); assert.ok(f.card._pending, "service acceptance alone does not confirm a wash");
  f.report("operation", "run"); assert.ok(f.card._pending, "active program must also match");
  f.report("activeProgram", eco); assert.equal(f.card._pending, null);
  assert.match(f.card._actions(), /data-action="stop"/);
  assert.doesNotMatch(f.card._actions(), /data-action="start"/);
});

test("fresh running/scheduled state confirms Start before its service response", async () => {
  for (const operation of ["run", "delayedstart"]) {
    const f = fixture(); let reject;
    f.hass.callService = () => new Promise((_, r) => { reject = r; });
    f.card._startProgram();
    f.report("activeProgram", eco); f.report("operation", operation);
    assert.equal(f.card._pending, null);
    reject(new Error("late response")); await Promise.resolve();
    assert.equal(f.card._commandError, "");
  }
});

test("program selection writes only Selected program and blocks stale Start until acknowledgement and state agree", async () => {
  const f = fixture(); let acknowledge;
  f.hass.callService = (...args) => { f.calls.push(args); return new Promise(resolve => { acknowledge = resolve; }); };
  f.card._selectProgram(quick); f.card._startProgram();
  assert.deepEqual(f.calls, [["select", "select_option", { entity_id: f.entities.selectedProgram, option: quick }]]);
  f.report("selectedProgram", quick); assert.ok(f.card._pending);
  acknowledge(); await Promise.resolve(); assert.equal(f.card._pending, null);
  f.card._startProgram();
  assert.deepEqual(f.calls[1], ["select", "select_option", { entity_id: f.entities.activeProgram, option: quick }]);
  f.card.disconnectedCallback();
});

test("a selection response does not enable Start before HA reports the selected value", async () => {
  const f = fixture(); f.card._selectProgram(quick); await Promise.resolve();
  assert.ok(f.card._pending); f.card._startProgram(); assert.equal(f.calls.length, 1);
  f.report("selectedProgram", quick); assert.equal(f.card._pending, null);
  assert.equal(f.card._startReason(), "");
});

test("early service rejection and synchronous exceptions show an error without a retry", async () => {
  for (const synchronous of [false, true]) {
    const f = fixture(); let count = 0;
    f.hass.callService = () => {
      count++; if (synchronous) throw new Error("denied"); return Promise.reject(new Error("denied"));
    };
    f.card._startProgram(); await Promise.resolve();
    assert.equal(count, 1); assert.equal(f.card._pending, null);
    assert.match(f.card._actions(), /role="alert"/); assert.match(f.card._commandError, /request failed/);
  }
});

test("timeout, config changes and disconnection clean up observation and ignore late replies", async () => {
  for (const end of ["timeout", "config", "disconnect"]) {
    const f = fixture(); let reject;
    f.hass.callService = (...args) => { f.calls.push(args); return new Promise((_, r) => { reject = r; }); };
    f.card._startProgram(); const request = f.card._pending;
    if (end === "timeout") f.card._finishCommand(request, f.card._text.commandTimeout);
    if (end === "config") f.card.setConfig({ entities: f.entities, title: "Updated" });
    if (end === "disconnect") f.card.disconnectedCallback();
    assert.equal(f.card._pending, null); assert.equal(f.card._commandTimer, null);
    const message = f.card._commandError;
    reject(new Error("late response")); await Promise.resolve();
    assert.equal(f.card._commandError, message); assert.equal(f.calls.length, 1);
  }
});
