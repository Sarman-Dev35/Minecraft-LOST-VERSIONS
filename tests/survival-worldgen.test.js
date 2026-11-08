import test from "node:test";
import assert from "node:assert/strict";
import { SurvivalState, MAX_HEALTH } from "../src/game/systems/survival.js";
import { generateTerrain, terrainHeight, biomeAt } from "../src/game/systems/worldgen.js";

test("player starts with ten hearts and no hunger meter", () => {
  const player = new SurvivalState();
  assert.equal(player.health, 20);
  assert.equal(player.maxHealth, MAX_HEALTH);
  assert.equal("hunger" in player, false);
});

test("damage lowers health and cannot make it negative", () => {
  const player = new SurvivalState();
  assert.equal(player.damage(6).health, 14);
  const dead = player.damage(99);
  assert.equal(dead.health, 0);
  assert.equal(dead.alive, false);
});

test("armor reduces incoming damage", () => {
  const player = new SurvivalState({ armor: 10 });
  assert.equal(player.damage(10).health, 14);
});

test("food heals according to classic direct-healing values", () => {
  const player = new SurvivalState({ health: 10 });
  assert.equal(player.eat("bread").health, 15);
  assert.equal(player.eat("cooked_porkchop").health, 20);
});

test("food cannot be wasted at full health or used while dead", () => {
  const player = new SurvivalState();
  assert.equal(player.eat("apple").reason, "health_full");
  player.damage(40);
  assert.equal(player.eat("bread").reason, "player_dead");
});

test("unknown items are not edible", () => {
  const player = new SurvivalState({ health: 12 });
  assert.equal(player.eat("diamond").reason, "not_food");
  assert.equal(player.health, 12);
});

test("respawn restores full health", () => {
  const player = new SurvivalState();
  player.damage(30);
  assert.equal(player.respawn().health, 20);
  assert.equal(player.alive, true);
});

test("terrain generation is deterministic for the same seed", () => {
  const a = generateTerrain({ width: 8, depth: 8, seed: 42 });
  const b = generateTerrain({ width: 8, depth: 8, seed: 42 });
  assert.deepEqual(a, b);
});

test("different seeds can produce different terrain", () => {
  const a = generateTerrain({ width: 12, depth: 12, seed: 42 });
  const b = generateTerrain({ width: 12, depth: 12, seed: 99 });
  assert.notDeepEqual(a, b);
});

test("terrain contains a solid surface and classic underground layers", () => {
  const blocks = generateTerrain({ width: 5, depth: 5, seed: 7, minY: -8 });
  assert.ok(blocks.some(block => block.id === "grass_block" || block.id === "sand"));
  assert.ok(blocks.some(block => block.id === "stone"));
  assert.ok(blocks.every(block => Number.isInteger(block.x) && Number.isInteger(block.y) && Number.isInteger(block.z)));
});

test("terrain generator rejects invalid chunk sizes", () => {
  assert.throws(() => generateTerrain({ width: 0, depth: 16 }), RangeError);
  assert.throws(() => generateTerrain({ width: 100, depth: 16 }), RangeError);
});

test("height and biome queries are deterministic", () => {
  assert.equal(terrainHeight(4, 8, 123), terrainHeight(4, 8, 123));
  assert.equal(biomeAt(4, 8, 123), biomeAt(4, 8, 123));
});
