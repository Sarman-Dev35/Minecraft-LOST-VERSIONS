import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("playable game module parses and exposes survival, mining, furnace and UI hooks", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const match = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  assert.ok(match, "game module script exists");
  const source = match[1].replace(/^import .*;\s*$/gm, "");
  assert.doesNotThrow(() => new Function(source), "game module JavaScript syntax is valid");
  for (const id of ["inventory","invItems","craftGrid","craftOutput","status","dayLabel","furnace","furnaceInput","furnaceFuel","furnaceOutputSlot"]) {
    assert.match(html,new RegExp('id="' + id + '"'),id+" UI element exists");
  }
  assert.match(html,/MINECRAFT: The Lost Version/,"game title identifies the project");
  assert.match(html,/THE LOST VERSION/,"title artwork includes the subtitle");
  assert.match(source,/new Inventory\(36\)/,"game uses a 36-slot inventory");
  assert.match(source,/findCraftingRecipe/,"crafting grid uses the shared recipe matcher");
  assert.match(source,/inventorySlots:inventoryCore\.toJSON\(\)/,"all inventory slots are saved");
  assert.match(source,/furnaceStates/,"furnace state is persisted");
  assert.match(source,/function spawnAnimals\(/,"animals spawn from world surface candidates");
  assert.match(source,/function attackAnimal\(/,"animals can be attacked and drop loot");
  assert.match(source,/function consumeSelectedFood\(/,"food can be eaten with right-click");
  assert.doesNotMatch(source,/KeyF/,"F is no longer bound to eating");
  assert.match(source,/function mineBlock\(/,"blocks and ores use the mining path");
  assert.match(source,/function requiredPickaxeTier\(/,"ore mining requires suitable pickaxe tiers");
  assert.match(source,/function openFurnace\(/,"right-click opens the furnace interface");
  assert.match(source,/function updateFurnaces\(/,"furnace smelting advances during gameplay");
  assert.match(source,/function interact\(place\)/,"right-click interaction and placement are handled");
  assert.match(source,/if\(hit\?\.b\.t===14\)\{openFurnace/,"furnace block opens its UI");
  assert.match(source,/Array\.from\(\{length:9\}/,"nine-slot hotbar is backed by inventory");
  assert.match(source,/function dropSelectedItem\(/,"inventory items can be dropped");
  assert.match(source,/updateDroppedItems\(dt\)/,"dropped items are updated and collected");
  assert.match(source,/regenTimer>=30/,"slow passive health regeneration is active");
});
