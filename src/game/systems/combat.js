// Classic Alpha/Beta-inspired melee damage values. Bare hand is the baseline.
const ATTACK_DAMAGE = Object.freeze({
  wooden_sword: 4, stone_sword: 5, iron_sword: 6, gold_sword: 4, diamond_sword: 7,
  wooden_axe: 7, stone_axe: 9, iron_axe: 9, gold_axe: 7, diamond_axe: 9,
  wooden_pickaxe: 2, stone_pickaxe: 3, iron_pickaxe: 4, gold_pickaxe: 2, diamond_pickaxe: 5
});
export function getAttackDamage(itemId = null) { return ATTACK_DAMAGE[itemId] ?? 1; }
export function getAttackDurabilityCost(itemId = null) { return ATTACK_DAMAGE[itemId] ? 1 : 0; }
export { ATTACK_DAMAGE };
