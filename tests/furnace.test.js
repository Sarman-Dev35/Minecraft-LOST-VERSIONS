import test from "node:test";
import assert from "node:assert/strict";
import { createFurnaceState, tickFurnace, FUEL_SECONDS } from "../src/game/systems/furnace.js";

test("furnace consumes fuel and smelts raw iron into an ingot",()=>{
 const state=createFurnaceState({input:{item:"raw_iron",count:1},fuel:{item:"coal",count:1}});
 const events=tickFurnace(state,10);
 assert.ok(events.includes("fuel_started"));
 assert.ok(events.includes("smelted"));
 assert.equal(state.input,null);
 assert.deepEqual(state.output,{item:"iron_ingot",count:1});
 assert.equal(state.fuel,null);
});
test("furnace waits without valid fuel and preserves its input",()=>{
 const state=createFurnaceState({input:{item:"raw_gold",count:2}});
 tickFurnace(state,20);
 assert.equal(state.input.count,2);
 assert.equal(state.progress,0);
});
test("furnace supports food cooking and fuel durations",()=>{
 const state=createFurnaceState({input:{item:"raw_chicken",count:2},fuel:{item:"oak_log",count:1}});
 tickFurnace(state,10);
 assert.deepEqual(state.output,{item:"cooked_chicken",count:1});
 assert.equal(FUEL_SECONDS.coal,80);
});
test("furnace will not overwrite an incompatible output stack",()=>{
 const state=createFurnaceState({input:{item:"raw_iron",count:1},fuel:{item:"coal",count:1},output:{item:"gold_ingot",count:1}});
 tickFurnace(state,20);
 assert.equal(state.input.count,1);
 assert.equal(state.output.item,"gold_ingot");
});
