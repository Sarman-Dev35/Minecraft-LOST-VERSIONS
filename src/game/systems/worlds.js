export const WORLD_MODES=Object.freeze(["survival","creative"]);
export const WORLD_DIFFICULTIES=Object.freeze(["peaceful","easy","normal","hard"]);
const DEFAULT_KEY="sarman-lost-versions-world-catalog";
function validWorld(w){return w&&typeof w.id==="string"&&typeof w.name==="string"&&Number.isSafeInteger(w.seed)&&Number.isInteger(w.radius)&&w.radius>=8&&w.radius<=64&&WORLD_MODES.includes(w.mode)&&WORLD_DIFFICULTIES.includes(w.difficulty)}
export class WorldCatalog{
 constructor(storage=globalThis.localStorage,key=DEFAULT_KEY){if(!storage)throw new TypeError("A storage implementation is required");this.storage=storage;this.key=key}
 list(){try{const data=JSON.parse(this.storage.getItem(this.key)||"[]");return Array.isArray(data)?data.filter(validWorld):[]}catch{return[]}}
 get(id){return this.list().find(w=>w.id===id)??null}
 create({name,seed,radius=24,mode="survival",difficulty="normal"}){const clean=String(name??"").trim().slice(0,32),numericSeed=Number(seed);if(!clean)throw new TypeError("World name is required");if(!Number.isSafeInteger(numericSeed))throw new RangeError("World seed must be a safe integer");const now=Date.now(),world={id:globalThis.crypto?.randomUUID?.()??"world-"+now.toString(36)+"-"+Math.random().toString(36).slice(2,9),name:clean,seed:numericSeed,radius:Number(radius),mode,difficulty,createdAt:now,updatedAt:now};if(!validWorld(world))throw new RangeError("Invalid world settings");this.storage.setItem(this.key,JSON.stringify([world,...this.list()]));return world}
 update(id,patch){const worlds=this.list(),i=worlds.findIndex(w=>w.id===id);if(i<0)return false;const next={...worlds[i],...patch,id,updatedAt:Date.now()};if(!validWorld(next))throw new RangeError("Invalid world metadata");worlds[i]=next;this.storage.setItem(this.key,JSON.stringify(worlds));return next}
 delete(id){const worlds=this.list(),next=worlds.filter(w=>w.id!==id);if(next.length===worlds.length)return false;this.storage.setItem(this.key,JSON.stringify(next));return true}
}
