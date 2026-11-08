export const ARMOR_SLOTS=Object.freeze(["helmet","chestplate","leggings","boots"]);
export const ARMOR_POINTS=Object.freeze({
 leather_helmet:1,leather_chestplate:3,leather_leggings:2,leather_boots:1,
 chainmail_helmet:2,chainmail_chestplate:5,chainmail_leggings:4,chainmail_boots:1,
 iron_helmet:2,iron_chestplate:6,iron_leggings:5,iron_boots:2,
 gold_helmet:2,gold_chestplate:5,gold_leggings:3,gold_boots:1,
 diamond_helmet:3,diamond_chestplate:8,diamond_leggings:6,diamond_boots:3
});
const SLOT_BY_ITEM=Object.freeze(Object.fromEntries(Object.keys(ARMOR_POINTS).map(id=>[id,ARMOR_SLOTS.find(slot=>id.endsWith(slot))])));
export function armorSlotForItem(id){return SLOT_BY_ITEM[id]??null}
export function createArmorEquipment(saved={}){return Object.fromEntries(ARMOR_SLOTS.map(slot=>{const piece=saved?.[slot];return[slot,piece&&SLOT_BY_ITEM[piece.item]===slot&&Number.isInteger(piece.durability)&&piece.durability>0?{item:piece.item,durability:piece.durability}:null]}))}
export function getArmorPoints(equipment={}){return ARMOR_SLOTS.reduce((n,slot)=>n+(equipment[slot]?ARMOR_POINTS[equipment[slot].item]??0:0),0)}
export function equipArmor(inventory,equipment,index){const item=inventory?.slots?.[index];if(!item||!Number.isInteger(index))return false;const slot=armorSlotForItem(item.item);if(!slot)return false;const previous=equipment[slot];equipment[slot]={item:item.item,durability:item.durability??1};inventory.slots[index]=previous?{...previous,count:1}:null;return true}
export function unequipArmor(inventory,equipment,slot){if(!ARMOR_SLOTS.includes(slot)||!equipment[slot])return false;const piece=equipment[slot];if(inventory.add(piece.item,1)!==0)return false;const stored=inventory.slots.find(s=>s?.item===piece.item);if(stored&&piece.durability)stored.durability=piece.durability;equipment[slot]=null;return true}
export function applyArmorDamage(equipment,rawDamage){const damage=Math.max(0,Number(rawDamage)||0),points=getArmorPoints(equipment),reduction=Math.min(.8,points*.04),remainingDamage=damage*(1-reduction),broken=[];if(damage>0)for(const slot of ARMOR_SLOTS){const piece=equipment[slot];if(!piece)continue;piece.durability-=1;if(piece.durability<=0){broken.push(piece.item);equipment[slot]=null}}return{damage:remainingDamage,reduced:damage-remainingDamage,armorPoints:points,reduction,broken}}
