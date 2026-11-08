/**
 * Deterministic bounded chunk streaming.
 * Generated terrain is recreated from the world seed; edits and entity snapshots
 * survive unload/reload and are serialized independently from active render data.
 */
export const CHUNK_SIZE = 16;
export const WORLD_LIMIT = 500000;
export const RENDER_DISTANCES = Object.freeze([2,4,6,8,10,12,16,20,24,28,32]);

export function chunkCoord(block) { return Math.floor(block / CHUNK_SIZE); }
export function chunkKey(cx, cz) { return `${cx},${cz}`; }
export function inWorld(x, z, limit = WORLD_LIMIT) {
  return Number.isFinite(x) && Number.isFinite(z) && Math.abs(x) <= limit && Math.abs(z) <= limit;
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
    const generated = this.generateChunk({ cx, cz, seed: this.seed });
    const blocks = Array.isArray(generated) ? generated : generated.blocks;
    const chunk = {
      cx, cz, key,
      blocks: structuredClone(blocks || []),
      spawnCandidates: structuredClone(generated.spawnCandidates || []),
      entities: structuredClone(this.entityStore.get(key) || []),
      dirty: false
    };
    const changes = this.blockChanges.get(key);
    if (changes) {
      const byPosition = new Map(chunk.blocks.map((b, i) => [`${b.x},${b.y},${b.z}`, i]));
      for (const change of changes) {
        const pos = `${change.x},${change.y},${change.z}`;
        const i = byPosition.get(pos);
        if (change.t === null) {
          if (i !== undefined) { chunk.blocks[i] = null; byPosition.delete(pos); }
        } else if (i !== undefined) chunk.blocks[i] = change;
        else { byPosition.set(pos, chunk.blocks.length); chunk.blocks.push(change); }
      }
      chunk.blocks = chunk.blocks.filter(Boolean);
    }
    this.active.set(key, chunk);
    return chunk;
  }

  setBlock(x, y, z, t) {
    if (![x,y,z].every(Number.isInteger) || (t !== null && !Number.isInteger(t)) || !inWorld(x,z,this.worldLimit)) return false;
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
    if (!entity || entity.id === undefined || !Number.isFinite(entity.x) || !Number.isFinite(entity.z)) return false;
    const key = this.keyForBlock(Math.floor(entity.x), Math.floor(entity.z));
    // A moving entity belongs to exactly one chunk; remove stale snapshots
    // from its previous chunk before writing the new position.
    for (const [otherKey, list] of this.entityStore) {
      if (otherKey !== key) this.entityStore.set(otherKey, list.filter(e => e.id !== entity.id));
    }
    for (const [otherKey, chunk] of this.active) {
      if (otherKey !== key) chunk.entities = chunk.entities.filter(e => e.id !== entity.id);
    }
    const entities = this.entityStore.get(key) || [];
    const i = entities.findIndex(e => e.id === entity.id);
    if (i >= 0) entities[i] = structuredClone(entity); else entities.push(structuredClone(entity));
    this.entityStore.set(key, entities);
    const active = this.active.get(key);
    if (active) active.entities = structuredClone(entities);
    return true;
  }

  unload(cx, cz) {
    const key = chunkKey(cx, cz);
    const chunk = this.active.get(key);
    if (!chunk) return;
    this.entityStore.set(key, structuredClone(chunk.entities));
    this.active.delete(key);
  }

  updateWindow(centerX, centerZ, radius) {
    if (!Number.isInteger(radius) || radius < 0 || radius > 32) throw new RangeError('Chunk render radius must be between 0 and 32');
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
    const entities = new Map(this.entityStore);
    for (const [key, chunk] of this.active) entities.set(key, structuredClone(chunk.entities));
    return {
      version: 2,
      seed: this.seed,
      worldLimit: this.worldLimit,
      blockChanges: [...this.blockChanges.entries()].map(([k,v]) => [k, structuredClone(v)]),
      entities: [...entities.entries()].map(([k,v]) => [k, structuredClone(v)])
    };
  }

  hydrate(data = {}) {
    this.active.clear();
    this.seed = Number.isFinite(data.seed) ? data.seed : this.seed;
    this.worldLimit = Number.isFinite(data.worldLimit) ? data.worldLimit : this.worldLimit;
    this.blockChanges = new Map(data.blockChanges || []);
    this.entityStore = new Map(data.entities || []);
  }
}


/**
 * Incremental chunk-window scheduler. It never generates the whole requested
 * render distance in one frame; callers invoke tick() with a small budget.
 */
export class ChunkScheduler {
  constructor({ store, onLoad = () => {}, onUnload = () => {}, maxLoadsPerTick = 1 } = {}) {
    if (!store || typeof store.load !== "function") throw new TypeError("A ChunkStore is required");
    if (!Number.isInteger(maxLoadsPerTick) || maxLoadsPerTick < 1) throw new RangeError("maxLoadsPerTick must be positive");
    this.store = store;
    this.onLoad = onLoad;
    this.onUnload = onUnload;
    this.maxLoadsPerTick = maxLoadsPerTick;
    this.radius = 2;
    this.center = { x: 0, z: 0 };
    this.wanted = new Set();
    this.queue = [];
  }

  update(centerX, centerZ, radius = this.radius) {
    if (!Number.isFinite(centerX) || !Number.isFinite(centerZ)) throw new TypeError("Chunk center must be finite");
    if (!Number.isInteger(radius) || radius < 2 || radius > 32) throw new RangeError("Render distance must be between 2 and 32 chunks");
    const cx = chunkCoord(centerX), cz = chunkCoord(centerZ);
    this.radius = radius;
    this.center = { x: cx, z: cz };
    const wanted = new Set();
    const candidates = [];
    for (let x = cx - radius; x <= cx + radius; x++) {
      for (let z = cz - radius; z <= cz + radius; z++) {
        if (!inWorld(x * CHUNK_SIZE, z * CHUNK_SIZE, this.store.worldLimit)) continue;
        const key = chunkKey(x, z);
        wanted.add(key);
        if (!this.store.active.has(key)) candidates.push({ x, z, key, distance: (x-cx)**2 + (z-cz)**2 });
      }
    }
    for (const chunk of [...this.store.active.values()]) {
      if (!wanted.has(chunk.key)) {
        this.onUnload(chunk);
        this.store.unload(chunk.cx, chunk.cz);
      }
    }
    candidates.sort((a,b) => a.distance-b.distance || a.x-b.x || a.z-b.z);
    this.wanted = wanted;
    this.queue = candidates;
    return { wanted: wanted.size, queued: this.queue.length, active: this.store.active.size };
  }

  tick(budget = this.maxLoadsPerTick) {
    if (!Number.isInteger(budget) || budget < 0) throw new RangeError("Chunk load budget must be a non-negative integer");
    let loaded = 0;
    while (loaded < budget && this.queue.length) {
      const next = this.queue.shift();
      if (!this.wanted.has(next.key) || this.store.active.has(next.key)) continue;
      const chunk = this.store.load(next.x, next.z);
      this.onLoad(chunk);
      loaded++;
    }
    return { loaded, remaining: this.queue.length, active: this.store.active.size };
  }

  clear() {
    for (const chunk of [...this.store.active.values()]) {
      this.onUnload(chunk);
      this.store.unload(chunk.cx, chunk.cz);
    }
    this.queue = [];
    this.wanted.clear();
  }
}
