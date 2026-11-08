import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("playable game module parses and exposes inventory/crafting UI hooks", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const match = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  assert.ok(match, "game module script exists");
  const source = match[1]
    .replace("import * as THREE from 'three';", "")
    .replace("import { Inventory } from './src/game/systems/inventory.js';", "")
    .replace("import { findCraftingRecipe } from './src/game/systems/crafting.js';", "")
    .replace("import { ITEMS, getItem } from './src/game/data/items.js';", "")
    .replace("import { getAttackDamage } from './src/game/systems/combat.js';", "");
  assert.doesNotThrow(() => new Function(source), "game module JavaScript syntax is valid");
  for (const id of ["inventory", "invItems", "craftGrid", "craftOutput", "status", "dayLabel"]) {
    assert.match(html, new RegExp('id="' + id + '"'), id + " UI element exists");
  }
  assert.match(source, /new Inventory\(36\)/, "game uses a 36-slot inventory");
  assert.match(source, /findCraftingRecipe/, "crafting grid uses the shared recipe matcher");
  assert.match(source, /inventorySlots:inventoryCore\.toJSON\(\)/, "all inventory slots are saved");
  assert.match(source, /function spawnAnimals\(/, "wandering animals are spawned");
  assert.match(source, /function attackAnimal\(/, "animals can be attacked and drop loot");
  assert.match(source, /function consumeSelectedFood\(/, "food can be eaten with right-click");
  assert.doesNotMatch(source, /KeyF/, "F is no longer bound to eating");
  assert.match(source, /function attackAnimal\(/, "left-click combat damages animals");
  assert.match(source, /getAttackDamage\(slot\?\.item\)/, "equipped item changes attack damage");
  assert.match(source, /function interact\(place\)/, "right-click interaction and placement are handled");
  assert.match(source, /if\(b\.t===5\)\{remove\(b\.x,b\.y,b\.z\);addItem\('Bed',1\)/, "left-click can mine and collect a bed");
  assert.match(source, /Array\.from\(\{length:9\}/, "nine-slot hotbar is backed by inventory");
  assert.match(source, /function dropSelectedItem\(/, "inventory items can be dropped");
  assert.match(source, /updateDroppedItems\(dt\)/, "dropped items are updated and collected");
  assert.match(source, /regenTimer>=30/, "slow passive health regeneration is active");
});
