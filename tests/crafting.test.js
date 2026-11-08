import test from "node:test";
import assert from "node:assert/strict";
import { Inventory } from "../src/game/systems/inventory.js";
import { ITEMS } from "../src/game/data/items.js";
import { RECIPES, SMELTING_RECIPES } from "../src/game/data/recipes.js";
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

test("empty crafting grid safely returns no recipe", () => {
  assert.equal(findCraftingRecipe(Array(9).fill(null), 3), null);
});

test("mirrored shaped recipes are accepted", () => {
  const grid = ["oak_planks", "oak_planks", null, "sticks", "oak_planks", null, "sticks", null, null];
  assert.equal(findCraftingRecipe(grid, 3)?.id, "wooden_axe");
});

test("all registered crafting and smelting recipes reference known items", () => {
  for (const recipe of RECIPES) {
    assert.ok(ITEMS[recipe.result.item], `unknown result item in ${recipe.id}`);
    const ingredients = recipe.type === "shapeless"
      ? recipe.ingredients
      : Object.values(recipe.key);
    for (const item of ingredients) assert.ok(ITEMS[item], `unknown ingredient ${item} in ${recipe.id}`);
  }
  for (const recipe of SMELTING_RECIPES) {
    assert.ok(ITEMS[recipe.input], `unknown smelting input in ${recipe.id}`);
    assert.ok(ITEMS[recipe.output.item], `unknown smelting output in ${recipe.id}`);
  }
});

test("rotated shaped recipes are accepted", () => {
  const recipe = {
    id: "test_rotation",
    type: "shaped",
    pattern: ["AB", " C"],
    key: { A: "oak_planks", B: "sticks", C: "coal" },
    result: { item: "torch", count: 1 },
    grid: 2
  };
  const rotated = [null, "oak_planks", "coal", "sticks"];
  assert.equal(findCraftingRecipe(rotated, 2, [recipe])?.id, "test_rotation");
});

test("36-slot survival inventory can hold the bed materials and crafted bed", () => {
  const inv = new Inventory(36);
  inv.add("wool", 3);
  inv.add("oak_planks", 3);
  const grid = ["wool", "wool", "wool", "oak_planks", "oak_planks", "oak_planks", null, null, null];
  const result = craftFromGrid(grid, 3, inv);
  assert.equal(result.ok, true);
  assert.equal(result.result.item, "bed");
  assert.equal(inv.count("wool"), 0);
  assert.equal(inv.count("oak_planks"), 0);
  assert.equal(inv.count("bed"), 1);
});

test("36-slot inventory persists all slots without exceeding stack limits", () => {
  const inv = new Inventory(36);
  inv.add("oak_log", 130);
  const restored = new Inventory(36, inv.toJSON());
  assert.equal(restored.count("oak_log"), 130);
  assert.equal(restored.slots.length, 36);
  assert.equal(restored.slots[0].count, 64);
  assert.equal(restored.slots[1].count, 64);
  assert.equal(restored.slots[2].count, 2);
});
