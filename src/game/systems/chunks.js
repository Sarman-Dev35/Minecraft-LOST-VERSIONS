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
