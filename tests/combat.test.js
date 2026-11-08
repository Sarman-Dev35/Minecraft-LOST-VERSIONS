import test from "node:test";
import assert from "node:assert/strict";
import { getAttackDamage } from "../src/game/systems/combat.js";

test("swords deal more melee damage than bare hands", () => {
  assert.equal(getAttackDamage(null), 1);
  assert.equal(getAttackDamage("wooden_sword"), 4);
  assert.equal(getAttackDamage("stone_sword"), 5);
  assert.equal(getAttackDamage("iron_sword"), 6);
  assert.equal(getAttackDamage("diamond_sword"), 7);
});

test("axes are powerful melee weapons and tools", () => {
  assert.equal(getAttackDamage("wooden_axe"), 7);
  assert.equal(getAttackDamage("stone_axe"), 9);
  assert.equal(getAttackDamage("iron_axe"), 9);
  assert.equal(getAttackDamage("diamond_axe"), 9);
});

test("non-weapon items use bare-hand damage", () => {
  assert.equal(getAttackDamage("oak_planks"), 1);
  assert.equal(getAttackDamage("raw_beef"), 1);
});
