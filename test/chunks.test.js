import test from 'node:test';
import assert from 'node:assert/strict';
import { ChunkStore, CHUNK_SIZE } from '../src/game/systems/chunks.js';

function generator({cx,cz}) {
  return [{x:cx*CHUNK_SIZE,y:0,z:cz*CHUNK_SIZE,t:0}];
}

test('loads only the requested chunk window', () => {
  const store=new ChunkStore({seed:123,generateChunk:generator});
  store.updateWindow(0,0,1);
  assert.equal(store.active.size,9);
  store.updateWindow(16*20,0,0);
  assert.equal(store.active.size,1);
});

test('block changes survive unload and reload', () => {
  const store=new ChunkStore({generateChunk:generator});
  const c=store.load(0,0);
  store.setBlock(2,5,2,7);
  store.unload(0,0);
  const reloaded=store.load(0,0);
  assert.equal(reloaded.blocks.find(b=>b.x===2&&b.y===5&&b.z===2)?.t,7);
});

test('entities persist after leaving and returning to a chunk', () => {
  const store=new ChunkStore({generateChunk:generator});
  store.load(0,0).entities.push({id:'cow-1',type:'cow',x:4,z:4,health:3});
  store.unload(0,0);
  const again=store.load(0,0);
  assert.equal(again.entities[0].id,'cow-1');
  assert.equal(again.entities[0].health,3);
});

test('world changes serialize independently from active chunks', () => {
  const store=new ChunkStore({seed:99,generateChunk:generator});
  store.setBlock(16,2,16,null);
  const data=store.serialize();
  const restored=new ChunkStore({generateChunk:generator});
  restored.hydrate(data);
  assert.equal(restored.seed,99);
  assert.equal(restored.load(1,1).blocks.length,0);
});
