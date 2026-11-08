// Deterministic classic-inspired Overworld generation for the browser prototype.
export const BLOCK=Object.freeze({GRASS:0,DIRT:1,STONE:2,LOG:3,LEAVES:4,BED:5,WOOL:6,COAL_ORE:7,IRON_ORE:8,GOLD_ORE:9,DIAMOND_ORE:10,REDSTONE_ORE:11,LAPIS_ORE:12,SAND:13,FURNACE:14});
export function hash2(x,z,seed=1){let n=(Math.imul(x|0,374761393)+Math.imul(z|0,668265263)+Math.imul(seed|0,1442695041))|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
export function hash3(x,y,z,seed=1){return hash2(x+y*31,z-y*17,seed^Math.imul(y+4099,1597334677))}
function noise(x,z,seed,scale){const gx=Math.floor(x/scale),gz=Math.floor(z/scale),fx=x/scale-gx,fz=z/scale-gz,sx=fx*fx*(3-2*fx),sz=fz*fz*(3-2*fz),a=hash2(gx,gz,seed),b=hash2(gx+1,gz,seed),c=hash2(gx,gz+1,seed),d=hash2(gx+1,gz+1,seed),top=a+(b-a)*sx,bottom=c+(d-c)*sx;return top+(bottom-top)*sz}
export function terrainHeight(x,z,seed=1){const broad=noise(x,z,seed,32)-.5,detail=noise(x,z,seed^0x5f3759df,11)-.5;return Math.max(3,Math.min(24,Math.floor(9+broad*12+detail*5)))}
export function biomeAt(x,z,seed=1){const climate=noise(x,z,seed^0x1b873593,72),vegetation=noise(x,z,seed^0x85ebca6b,38);if(climate<.19)return"plains";if(vegetation>.66)return"forest";if(vegetation>.57)return"birch_forest";if(climate>.78)return"pine_forest";return"hills"}
function caveAt(x,y,z,seed){return y<-2&&hash3(Math.floor(x/2),Math.floor(y/2),Math.floor(z/2),seed+31)>.89&&hash3(Math.floor(x/4),Math.floor(y/3),Math.floor(z/4),seed+47)>.48}
function addTree(blocks,x,y,z,biome,seed){const pine=biome==="pine_forest",trunk=pine?6+Math.floor(hash2(x,z,seed)*3):4+Math.floor(hash2(x,z,seed)*2);for(let i=1;i<=trunk;i++)blocks.push({x,y:y+i,z,t:BLOCK.LOG});const crown=y+trunk;if(pine){for(let layer=0;layer<5;layer++){const r=Math.max(1,3-Math.floor(layer/2));for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++)if(Math.abs(dx)+Math.abs(dz)<=r+1&&hash2(x+dx,z+dz,seed+layer)>.1)blocks.push({x:x+dx,y:crown-3+layer,z:z+dz,t:BLOCK.LEAVES})}}else{for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=-1;dy<=2;dy++)if(Math.abs(dx)+Math.abs(dz)+(dy===2?1:0)<=4&&hash2(x+dx,z+dz,seed+dy)>.08)blocks.push({x:x+dx,y:crown+dy,z:z+dz,t:BLOCK.LEAVES})}}
export function generateOverworld(radius=24,seed=1){if(!Number.isInteger(radius)||radius<8||radius>32||!Number.isInteger(seed))throw new RangeError("Invalid Overworld radius or seed");const blocks=[],trees=[],spawnCandidates=[],lookup=new Map(),put=(x,y,z,t)=>{const b={x,y,z,t};lookup.set(x+","+y+","+z,b);blocks.push(b)};for(let x=-radius;x<=radius;x++)for(let z=-radius;z<=radius;z++){const h=terrainHeight(x,z,seed),biome=biomeAt(x,z,seed),beach=biome==="plains"&&h<=5;for(let y=-18;y<=h;y++){if(caveAt(x,y,z,seed))continue;let t=y===h?(beach?BLOCK.SAND:BLOCK.GRASS):y>=h-3?(beach?BLOCK.SAND:BLOCK.DIRT):BLOCK.STONE;if(t===BLOCK.STONE){const r=hash3(x,y,z,seed+101);if(y<=-14&&r>.9992)t=BLOCK.DIAMOND_ORE;else if(y<=-9&&r>.998)t=BLOCK.GOLD_ORE;else if(y<=-8&&r>.997)t=BLOCK.REDSTONE_ORE;else if(y<=-6&&r>.996)t=BLOCK.LAPIS_ORE;else if(y<=-5&&r>.994)t=BLOCK.IRON_ORE;else if(y<=-3&&r>.988)t=BLOCK.COAL_ORE}put(x,y,z,t)}if(Math.abs(x)>4||Math.abs(z)>4){const density=biome==="plains"?.004:biome==="hills"?.012:.035;if(hash2(x,z,seed+5)<density){trees.push({x,z,biome});addTree(blocks,x,h,z,biome,seed)}else if(!beach&&hash2(x,z,seed+11)>.7)spawnCandidates.push({x,y:h+1,z,biome})}}const guaranteed=[{x:-radius+5,min:-18,max:-3,t:BLOCK.COAL_ORE},{x:-radius+7,min:-10,max:-5,t:BLOCK.IRON_ORE},{x:-radius+9,min:-16,max:-9,t:BLOCK.GOLD_ORE},{x:-radius+11,min:-18,max:-14,t:BLOCK.DIAMOND_ORE},{x:-radius+13,min:-14,max:-8,t:BLOCK.REDSTONE_ORE},{x:-radius+15,min:-12,max:-6,t:BLOCK.LAPIS_ORE}];for(const ore of guaranteed){const candidates=blocks.filter(b=>b.t===BLOCK.STONE&&b.x>=ore.x-2&&b.x<=ore.x+2&&b.y>=ore.min&&b.y<=ore.max);candidates.sort((a,b)=>Math.abs(a.x-ore.x)+Math.abs(a.z-(radius-2))-Math.abs(b.x-ore.x)-Math.abs(b.z-(radius-2)));if(candidates[0])candidates[0].t=ore.t}const unique=[...new Map(blocks.map(b=>[b.x+","+b.y+","+b.z,b])).values()];return{blocks:unique,trees,spawnCandidates,seed,radius}}

const ORE_TABLE=Object.freeze([
 {id:"diamond_ore",minY:-24,maxY:-14,rarity:.002},
 {id:"gold_ore",minY:-24,maxY:-4,rarity:.006},
 {id:"redstone_ore",minY:-24,maxY:-10,rarity:.009},
 {id:"lapis_ore",minY:-20,maxY:-3,rarity:.004},
 {id:"iron_ore",minY:-24,maxY:12,rarity:.018},
 {id:"coal_ore",minY:-24,maxY:24,rarity:.035}
]);
export const CLASSIC_ORES=ORE_TABLE;
export function generateTerrain({originX=0,originZ=0,width=16,depth=16,seed=1,minY=-24}={}){
 if(![originX,originZ,width,depth,seed,minY].every(Number.isInteger)||width<1||depth<1||width>64||depth>64)throw new RangeError("Invalid terrain generation bounds or seed");
 const blocks=[];
 for(let x=originX;x<originX+width;x++)for(let z=originZ;z<originZ+depth;z++){
  const surface=terrainHeight(x,z,seed),biome=biomeAt(x,z,seed);
  for(let y=minY;y<=surface;y++){
   if(y<surface-3&&y>minY+2&&hash3(x,y,z,seed)>.91)continue;
   let id=y===surface?"grass_block":y>=surface-3?"dirt":"stone";
   if(id==="stone"){const roll=hash3(x+7919,y-104729,z+1543,seed),ore=ORE_TABLE.find(o=>y>=o.minY&&y<=o.maxY&&roll<o.rarity);if(ore)id=ore.id}
   blocks.push({x,y,z,id,biome});
  }
 }
 return blocks;
}
