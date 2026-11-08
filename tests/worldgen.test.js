import test from "node:test";
import assert from "node:assert/strict";
import { generateOverworld, terrainHeight, biomeAt, BLOCK } from "../src/game/systems/worldgen.js";

test("world generation is deterministic for the same seed",()=>{
 const a=generateOverworld(10,77),b=generateOverworld(10,77);
 assert.deepEqual(a.blocks,b.blocks);
 assert.deepEqual(a.trees,b.trees);
});
test("terrain has a grass/dirt/stone profile and varied elevations",()=>{
 const world=generateOverworld(12,3);
 assert.ok(world.blocks.some(b=>b.t===BLOCK.GRASS));
 assert.ok(world.blocks.some(b=>b.t===BLOCK.DIRT));
 assert.ok(world.blocks.some(b=>b.t===BLOCK.STONE));
 assert.ok(new Set(Array.from({length:20},(_,i)=>terrainHeight(i-10,3))).size>3);
});
test("seeded Overworld includes underground ore deposits",()=>{
 const world=generateOverworld(24,1),ores=new Set([BLOCK.COAL_ORE,BLOCK.IRON_ORE,BLOCK.GOLD_ORE,BLOCK.DIAMOND_ORE,BLOCK.REDSTONE_ORE,BLOCK.LAPIS_ORE]);
 for(const ore of ores)assert.ok(world.blocks.some(b=>b.t===ore),"missing ore block "+ore);
});
test("tree and animal spawn candidates use forest/plains biomes",()=>{
 const world=generateOverworld(20,4);
 assert.ok(world.trees.length>0);
 assert.ok(world.spawnCandidates.length>0);
 assert.ok(world.spawnCandidates.every(p=>["plains","birch_forest","pine_forest","forest","hills"].includes(p.biome)));
 assert.ok(["plains","birch_forest","pine_forest","hills","forest"].includes(biomeAt(0,0)));
});
