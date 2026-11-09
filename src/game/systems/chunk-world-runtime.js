import { ChunkStore, ChunkScheduler, RENDER_DISTANCES } from './chunks.js';
import { generateChunkData } from './worldgen.js';

/**
 * Bridges ChunkStore with the live Three.js world.
 * The authoritative persistent data stays in ChunkStore; the active world map
 * only contains currently streamed chunks.
 */
export class ChunkWorldRuntime {
  constructor({ seed = 1, renderDistance = 8, renderer, onChunkLoaded = () => {}, onChunkUnloaded = () => {}, maxLoadsPerTick = 2 } = {}) {
    if (!RENDER_DISTANCES.includes(renderDistance)) throw new RangeError('Render distance must be a supported 2–32 chunk value');
    this.store = new ChunkStore({
      seed,
      generateChunk: ({ cx, cz, seed: worldSeed }) => generateChunkData(cx, cz, worldSeed)
    });
    this.renderer = renderer;
    this.onChunkLoaded = onChunkLoaded;
    this.onChunkUnloaded = onChunkUnloaded;
    this.scheduler = new ChunkScheduler({
      store: this.store,
      maxLoadsPerTick,
      onLoad: chunk => {
        this.renderer?.build(chunk);
        this.onChunkLoaded(chunk);
      },
      onUnload: chunk => {
        this.renderer?.unload(chunk.key);
        this.onChunkUnloaded(chunk);
      }
    });
    this.renderDistance = renderDistance;
    this.lastCenterKey = null;
  }

  setRenderDistance(distance) {
    if (!RENDER_DISTANCES.includes(distance)) throw new RangeError('Render distance must be one of the 2–32 chunk presets');
    this.renderDistance = distance;
    this.lastCenterKey = null;
  }

  updatePlayer(x, z) {
    const centerKey = Math.floor(x / 16) + ',' + Math.floor(z / 16) + ',' + this.renderDistance;
    if (centerKey !== this.lastCenterKey) {
      this.scheduler.update(x, z, this.renderDistance);
      this.lastCenterKey = centerKey;
    }
    return this.scheduler.tick();
  }

  setBlock(x, y, z, type) {
    const changed = this.store.setBlock(x, y, z, type);
    if (!changed) return false;
    const chunk = this.store.active.get(this.store.keyForBlock(x, z));
    if (chunk) this.renderer?.build(chunk);
    return true;
  }

  snapshotEntities(entities) {
    const byChunk = new Map();
    for (const entity of entities || []) {
      if (!entity || !Number.isFinite(entity.x) || !Number.isFinite(entity.z)) continue;
      const key = this.store.keyForBlock(Math.floor(entity.x), Math.floor(entity.z));
      const list = byChunk.get(key) || [];
      list.push(entity);
      byChunk.set(key, list);
    }
    for (const [key, chunk] of this.store.active) {
      this.store.setEntitiesForChunk(chunk.cx, chunk.cz, byChunk.get(key) || []);
    }
  }

  serialize() {
    return this.store.serialize();
  }

  hydrate(data) {
    this.store.hydrate(data);
    this.lastCenterKey = null;
  }

  clear() {
    this.scheduler.clear();
    this.renderer?.clear();
    this.lastCenterKey = null;
  }
}
