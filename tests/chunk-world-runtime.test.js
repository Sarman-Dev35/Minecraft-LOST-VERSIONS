import test from 'node:test';
import assert from 'node:assert/strict';
import { ChunkWorldRuntime } from '../src/game/systems/chunk-world-runtime.js';

function fakeRenderer() {
  const built = [], unloaded = [];
  return {
    built, unloaded,
    build(chunk) { built.push(chunk.key); },
    unload(key) { unloaded.push(key); },
    clear() {}
  };
}

test('live runtime streams chunks around the player incrementally', () => {
  const renderer = fakeRenderer();
  const runtime = new ChunkWorldRuntime({ seed: 42, renderDistance: 2, renderer, maxLoadsPerTick: 3 });
  const first = runtime.updatePlayer(0, 0);
  assert.equal(first.loaded, 3);
  assert.equal(runtime.store.active.size, 3);
  assert.equal(renderer.built.length, 3);
});

test('live runtime persists block edits and entity snapshots', () => {
  const runtime = new ChunkWorldRuntime({ seed: 9, renderDistance: 2, maxLoadsPerTick: 25 });
  runtime.updatePlayer(0, 0);
  assert.equal(runtime.setBlock(1, 30, 1, 14), true);
  runtime.snapshotEntities([{ id: 'sheep-1', x: 2, y: 10, z: 3, health: 3 }]);
  const saved = runtime.serialize();
  const restored = new ChunkWorldRuntime({ seed: 1, renderDistance: 2, maxLoadsPerTick: 25 });
  restored.hydrate(saved);
  restored.updatePlayer(0, 0);
  const chunk = restored.store.active.get('0,0');
  assert.equal(chunk.blocks.find(b => b.x === 1 && b.y === 30 && b.z === 1)?.t, 14);
  assert.deepEqual(chunk.entities, [{ id: 'sheep-1', x: 2, y: 10, z: 3, health: 3 }]);
});

test('runtime only accepts Java-style 2–32 chunk presets', () => {
  const runtime = new ChunkWorldRuntime({ renderDistance: 8 });
  runtime.setRenderDistance(32);
  assert.equal(runtime.renderDistance, 32);
  assert.throws(() => runtime.setRenderDistance(3), RangeError);
  assert.throws(() => new ChunkWorldRuntime({ renderDistance: 1 }), RangeError);
});
