/**
 * Deterministic, bounded chunk streaming for The Lost Version.
 * Only active chunks are kept in RAM. Generated terrain is recreated from the
 * same seed; player changes and persistent entities are stored as deltas.
 */
export const CHUNK_SIZE = 16;
export const WORLD_LIMIT = 500000;

export function chunkCoord(block) {
  return Math.floor(block / CHUNK_SIZE);
}
export function chunkKey(cx, cz) {
  return `${cx},${cz}`;
}
export function inWorld(x, z) {
  return Math.abs(x) <= WORLD_LIMIT && Math.abs(z) <= WORLD_LIMIT;
}

export class ChunkStore {
  constructor({ seed = 1, generateChunk, worldLimit = WORLD_LIMIT } = {}) {
    if (typeof generateChunk !== 'function') throw new TypeError('generateChunk is required');
    this.seed = seed;
    this.generateChunk = generateChunk;
    this.worldLimit = worldLimit;
    this.active = new Map();
    this.blockChanges = new Map();
    this.entityStore = new Map();
  }

  keyForBlock(x, z) { return chunkKey(chunkCoord(x), chunkCoord(z)); }

  load(cx, cz) {
    const key = chunkKey(cx, cz);
    if (this.active.has(key)) return this.active.get(key);
    const chunk = {
      cx, cz, key,
      blocks: this.generateChunk({ cx, cz, seed: this.seed }),
      entities: structuredClone(this.entityStore.get(key) || []),
      dirty: false
    };
    const changes = this.blockChanges.get(key);
    if (changes) {
      for (const change of changes) {
        const i = chunk.blocks.findIndex(b => b.x === change.x && b.y === change.y && b.z === change.z);
        if (change.t === null) {
          if (i >= 0) chunk.blocks.splice(i, 1);
        } else if (i >= 0) chunk.blocks[i] = change;
        else chunk.blocks.push(change);
      }
    }
    this.active.set(key, chunk);
    return chunk;
  }

  setBlock(x, y, z, t) {
    if (Math.abs(x) > this.worldLimit || Math.abs(z) > this.worldLimit) return false;
    const key = this.keyForBlock(x, z);
    const change = { x, y, z, t };
    const list = this.blockChanges.get(key) || [];
    const i = list.findIndex(b => b.x === x && b.y === y && b.z === z);
    if (i >= 0) list[i] = change; else list.push(change);
    this.blockChanges.set(key, list);
    const active = this.active.get(key);
    if (active) {
      const j = active.blocks.findIndex(b => b.x === x && b.y === y && b.z === z);
      if (t === null) { if (j >= 0) active.blocks.splice(j, 1); }
      else if (j >= 0) active.blocks[j] = change;
      else active.blocks.push(change);
      active.dirty = true;
    }
    return true;
  }

  setEntitiesForChunk(cx, cz, entities) {
    const key = chunkKey(cx, cz);
    const snapshot = structuredClone(entities);
    this.entityStore.set(key, snapshot);
    const active = this.active.get(key);
    if (active) active.entities = structuredClone(snapshot);
  }

  updateEntity(entity) {
    const key = this.keyForBlock(Math.floor(entity.x), Math.floor(entity.z));
    const entities = this.entityStore.get(key) || [];
    const i = entities.findIndex(e => e.id === entity.id);
    if (i >= 0) entities[i] = structuredClone(entity); else entities.push(structuredClone(entity));
    this.entityStore.set(key, entities);
  }

  unload(cx, cz) {
    const key = chunkKey(cx, cz);
    const chunk = this.active.get(key);
    if (!chunk) return;
    this.entityStore.set(key, structuredClone(chunk.entities));
    this.active.delete(key);
  }

  updateWindow(centerX, centerZ, radius) {
    const cx = chunkCoord(centerX), cz = chunkCoord(centerZ);
    const wanted = new Set();
    for (let x = cx - radius; x <= cx + radius; x++) {
      for (let z = cz - radius; z <= cz + radius; z++) {
        const minX = x * CHUNK_SIZE, minZ = z * CHUNK_SIZE;
        if (Math.abs(minX) > this.worldLimit + CHUNK_SIZE || Math.abs(minZ) > this.worldLimit + CHUNK_SIZE) continue;
        const key = chunkKey(x, z);
        wanted.add(key);
        this.load(x, z);
      }
    }
    for (const chunk of [...this.active.values()]) if (!wanted.has(chunk.key)) this.unload(chunk.cx, chunk.cz);
    return [...this.active.values()];
  }

  serialize() {
    return {
      version: 1,
      seed: this.seed,
      worldLimit: this.worldLimit,
      blockChanges: [...this.blockChanges.entries()],
      entities: [...this.entityStore.entries()]
    };
  }

  hydrate(data = {}) {
    this.seed = Number.isFinite(data.seed) ? data.seed : this.seed;
    this.worldLimit = Number.isFinite(data.worldLimit) ? data.worldLimit : this.worldLimit;
    this.blockChanges = new Map(data.blockChanges || []);
    this.entityStore = new Map(data.entities || []);
  }
}
