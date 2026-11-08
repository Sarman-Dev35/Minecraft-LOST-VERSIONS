import test from "node:test";
import assert from "node:assert/strict";
import { SurvivalState, FOOD_HEALING } from "../src/game/systems/survival.js";
import { getItem } from "../src/game/data/items.js";

test("raw meat from animals is registered as edible food", () => {
  for (const id of ["raw_beef", "raw_porkchop", "raw_chicken"]) {
    assert.equal(getItem(id)?.type, "food");
    assert.ok(FOOD_HEALING[id] > 0);
  }
});

test("animal meat restores health directly without a hunger mechanic", () => {
  const player = new SurvivalState({ health: 10 });
  const result = player.eat("raw_beef");
  assert.equal(result.consumed, true);
  assert.equal(player.health, 13);
  assert.equal(player.alive, true);
});

test("cooked animal food restores more health than raw food", () => {
  assert.ok(FOOD_HEALING.cooked_beef > FOOD_HEALING.raw_beef);
  assert.ok(FOOD_HEALING.cooked_chicken > FOOD_HEALING.raw_chicken);
});

test("food is not consumed when health is already full", () => {
  const player = new SurvivalState({ health: 20 });
  const result = player.eat("raw_chicken");
  assert.equal(result.consumed, false);
  assert.equal(result.reason, "health_full");
  assert.equal(player.health, 20);
});
