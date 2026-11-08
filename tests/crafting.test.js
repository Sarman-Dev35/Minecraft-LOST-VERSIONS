import test from "node:test";
import assert from "node:assert/strict";
import { Inventory } from "../src/game/systems/inventory.js";
import { findCraftingRecipe, craftFromGrid } from "../src/game/systems/crafting.js";

test("inventory stacks items and returns overflow", () => {
  const inv = new Inventory(2);
  assert.equal(inv.add("oak_planks", 70), 0);
  assert.equal(inv.count("oak_planks"), 70);
  assert.equal(inv.slots[0].count, 64);
  assert.equal(inv.slots[1].count, 6);
  assert.equal(inv.add("diamond", 1), 1);
});

test("2x2 recipe crafts planks from one log", () => {
  const inv = new Inventory(9);
  inv.add("oak_log", 2);
  const result = craftFromGrid(["oak_log", null, null, null], 2, inv);
  assert.equal(result.ok, true);
  assert.equal(result.result.item, "oak_planks");
  assert.equal(inv.count("oak_log"), 1);
  assert.equal(inv.count("oak_planks"), 4);
});

test("3x3 recipe matches a pickaxe and consumes exact ingredients", () => {
  const inv = new Inventory(9);
  inv.add("oak_planks", 3);
  inv.add("sticks", 2);
  const grid = ["oak_planks", "oak_planks", "oak_planks", null, "sticks", null, null, "sticks", null];
  const result = craftFromGrid(grid, 3, inv);
  assert.equal(result.ok, true);
  assert.equal(result.result.item, "wooden_pickaxe");
  assert.equal(inv.count("oak_planks"), 0);
  assert.equal(inv.count("sticks"), 0);
  assert.equal(inv.count("wooden_pickaxe"), 1);
});

test("crafting rejects wrong patterns and leaves inventory unchanged", () => {
  const inv = new Inventory(9);
  inv.add("oak_planks", 3);
  inv.add("sticks", 2);
  const grid = ["oak_planks", "sticks", "oak_planks", null, "sticks", null, null, null, null];
  assert.equal(findCraftingRecipe(grid, 3), null);
  assert.equal(craftFromGrid(grid, 3, inv).ok, false);
  assert.equal(inv.count("oak_planks"), 3);
});

test("inventory-full crafting does not consume ingredients", () => {
  const inv = new Inventory(1);
  inv.add("oak_log", 1);
  inv.add("diamond", 1);
  assert.equal(craftFromGrid(["oak_log", null, null, null], 2, inv).reason, "inventory_full");
  assert.equal(inv.count("oak_log"), 1);
});
