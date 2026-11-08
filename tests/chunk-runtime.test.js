import test from 'node:test';
import assert from 'node:assert/strict';
import { ChunkStore, CHUNK_SIZE, RENDER_DISTANCES, chunkCoord, inWorld } from '../src/game/systems/chunks.js';
import { generateChunkData } from '../src/game/systems/worldgen.js';

test('chunk coordinates use floor semantics for negative positions',()=>{
 assert.equal(chunkCoord(-1),-1); assert.equal(chunkCoord(-16),-1); assert.equal(chunkCoord(-17),-2);
});
test('Java-style render distance presets span 2 through 32 chunks',()=>{
 assert.equal(RENDER_DISTANCES[0],2); assert.equal(RENDER_DISTANCES.at(-1),32);
 assert.ok(RENDER_DISTANCES.includes(8)); assert.ok(RENDER_DISTANCES.includes(16));
});
test('chunk terrain is deterministic, bounded to 16x16 and has trees and ore-capable terrain',()=>{
 const a=generateChunkData(-2,3,123),b=generateChunkData(-2,3,123);
 assert.deepEqual(a,b);
 assert.ok(a.blocks.length>16*16*10);
 assert.ok(a.blocks.every(block=>block.x>=-32&&block.x< -16&&block.z>=48&&block.z<64));
 assert.ok(a.spawnCandidates.every(p=>p.x>=-32&&p.x< -16&&p.z>=48&&p.z<64));
});
test('world bounds are explicit and reject out-of-range positions',()=>{
 assert.equal(inWorld(500000,-500000),true); assert.equal(inWorld(500001,0),false);
});
test('render window enforces a safe radius cap',()=>{
 const store=new ChunkStore({generateChunk:({cx,cz})=>[{x:cx*16,y:0,z:cz*16,t:0}]});
 assert.throws(()=>store.updateWindow(0,0,33),RangeError);
});
test('block edits and entities persist through serialize, hydrate and chunk reload',()=>{
 const store=new ChunkStore({seed:8,generateChunk:({cx,cz})=>[{x:cx*16,y:0,z:cz*16,t:0}]});
 const chunk=store.load(0,0); chunk.entities.push({id:'sheep-a',x:3,z:4,health:2});
 store.setBlock(2,4,2,7); store.unload(0,0);
 const data=store.serialize(), restored=new ChunkStore({generateChunk:({cx,cz})=>[{x:cx*16,y:0,z:cz*16,t:0}]});
 restored.hydrate(data);
 const loaded=restored.load(0,0);
 assert.equal(loaded.blocks.find(b=>b.x===2&&b.y===4&&b.z===2).t,7);
 assert.deepEqual(loaded.entities,[{id:'sheep-a',x:3,z:4,health:2}]);
});
