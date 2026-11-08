import { RECIPES } from "../data/recipes.js";
import { countIngredients } from "./inventory.js";

const trimPattern = pattern => {
  const rows = pattern.map(row => [...row]);
  while (rows.length && rows[0].every(cell => cell === " ")) rows.shift();
  while (rows.length && rows.at(-1).every(cell => cell === " ")) rows.pop();
  if (!rows.length) return [];
  while (rows.every(row => row[0] === " ")) rows.forEach(row => row.shift());
  while (rows.every(row => row.at(-1) === " ")) rows.forEach(row => row.pop());
  return rows.map(row => row.join(""));
};

function matchesShaped(grid, size, recipe) {
  const rows = [];
  for (let y = 0; y < size; y++) rows.push(grid.slice(y * size, (y + 1) * size).map(x => x ? Object.entries(recipe.key).find(([, id]) => id === x)?.[0] ?? "?" : " ").join(""));
  const target = trimPattern(recipe.pattern);
  const actual = trimPattern(rows);
  if (!target.length || !actual.length || target.length > size || target[0].length > size) return false;
  const equals = (a, b) => a.length === b.length && a.every((row, i) => row === b[i]);
  const rotate = matrix => matrix[0].map((_, column) =>
    matrix.map(row => row[column]).reverse()
  );
  const variants = [];
  let current = actual.map(row => [...row]);
  for (let turn = 0; turn < 4; turn++) {
    variants.push(current.map(row => row.join("")));
    variants.push(current.map(row => [...row].reverse().join("")));
    current = rotate(current);
  }
  return variants.some(v => equals(v, target));
}

export function findCraftingRecipe(grid, size, recipes = RECIPES) {
  if (![2, 3].includes(size) || grid.length !== size * size) return null;
  const counts = countIngredients(grid);
  for (const recipe of recipes) {
    if (recipe.grid > size) continue;
    if (recipe.type === "shapeless") {
      const required = countIngredients(recipe.ingredients);
      if (Object.keys(counts).length === Object.keys(required).length &&
          Object.entries(required).every(([id, n]) => counts[id] === n)) return recipe;
    } else if (recipe.type === "shaped" && matchesShaped(grid, size, recipe)) {
      return recipe;
    }
  }
  return null;
}

export function craftFromGrid(grid, size, inventory, recipes = RECIPES) {
  const recipe = findCraftingRecipe(grid, size, recipes);
  if (!recipe) return { ok: false, reason: "no_recipe" };
  const ingredients = recipe.type === "shapeless"
    ? countIngredients(recipe.ingredients)
    : countIngredients(grid);
  if (!inventory.hasIngredients(ingredients)) return { ok: false, reason: "missing_ingredients" };
  if (!inventory.canAdd(recipe.result.item, recipe.result.count)) return { ok: false, reason: "inventory_full" };
  for (const [item, count] of Object.entries(ingredients)) inventory.remove(item, count);
  inventory.add(recipe.result.item, recipe.result.count);
  return { ok: true, recipe, result: { ...recipe.result } };
}
