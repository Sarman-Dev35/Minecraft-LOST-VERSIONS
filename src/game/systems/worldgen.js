// Deterministic, dependency-free classic terrain generator.
// It returns block records only; rendering/chunk streaming are handled by the game runtime.
const ORES = Object.freeze([
  { id: "coal_ore", minY: -24, maxY: 24, rarity: 0.035 },
  { id: "iron_ore", minY: -24, maxY: 12, rarity: 0.018 },
  { id: "gold_ore", minY: -24, maxY: -4, rarity: 0.006 },
  { id: "redstone_ore", minY: -24, maxY: -10, rarity: 0.009 },
  { id: "lapis_ore", minY: -20, maxY: -3, rarity: 0.004 },
  { id: "diamond_ore", minY: -24, maxY: -14, rarity: 0.002 }
]);
function hash2(x,z,seed){let n=(Math.imul(x,374761393)+Math.imul(z,668265263)+Math.imul(seed,1442695041))|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function hash3(x,y,z,seed){return hash2(x+y*31,z-y*17,seed^Math.imul(y+4099,1597334677))}
function smoothNoise(x,z,seed,scale){const gx=Math.floor(x/scale),gz=Math.floor(z/scale),fx=x/scale-gx,fz=z/scale-gz,sx=fx*fx*(3-2*fx),sz=fz*fz*(3-2*fz),a=hash2(gx,gz,seed),b=hash2(gx+1,gz,seed),c=hash2(gx,gz+1,seed),d=hash2(gx+1,gz+1,seed),top=a+(b-a)*sx,bottom=c+(d-c)*sx;return top+(bottom-top)*sz}
export function terrainHeight(x,z,seed=1){const broad=smoothNoise(x,z,seed,32)-.5,detail=smoothNoise(x,z,seed^0x5f3759df,11)-.5;return Math.max(2,Math.min(28,Math.floor(10+broad*13+detail*5)))}
export function biomeAt(x,z,seed=1){const climate=smoothNoise(x,z,seed^0x1b873593,72),vegetation=smoothNoise(x,z,seed^0x85ebca6b,38);if(climate<.22)return"desert";if(vegetation>.61)return"forest";return"plains"}
export function generateTerrain({originX=0,originZ=0,width=16,depth=16,seed=1,minY=-24}={}){if(![originX,originZ,width,depth,seed,minY].every(Number.isInteger)||width<1||depth<1||width>64||depth>64)throw new RangeError("Invalid terrain generation bounds or seed");const blocks=[];for(let x=originX;x<originX+width;x++)for(let z=originZ;z<originZ+depth;z++){const surface=terrainHeight(x,z,seed),biome=biomeAt(x,z,seed);for(let y=minY;y<=surface;y++){if(y<surface-3&&y>minY+2&&hash3(x,y,z,seed)>.91)continue;let id=y===surface?(biome==="desert"?"sand":"grass_block"):y>=surface-3?(biome==="desert"?"sand":"dirt"):"stone";if(id==="stone"){const oreRoll=hash3(x+7919,y-104729,z+1543,seed),ore=ORES.find(c=>y>=c.minY&&y<=c.maxY&&oreRoll<c.rarity);if(ore)id=ore.id}blocks.push({x,y,z,id,biome})}}return blocks}
export const CLASSIC_ORES=ORES;
