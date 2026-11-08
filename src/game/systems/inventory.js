import { ITEMS, getItem } from "../data/items.js";

export class Inventory {
  constructor(size = 36, slots = null) {
    if (!Number.isInteger(size) || size < 1) throw new RangeError("Inventory size must be positive");
    this.size = size;
    this.slots = Array.from({ length: size }, (_, i) => {
      const slot = slots?.[i];
      return slot?.item && getItem(slot.item) && Number.isInteger(slot.count) && slot.count > 0
        ? { item: slot.item, count: Math.min(slot.count, getItem(slot.item).stack), ...(Number.isInteger(slot.durability) ? { durability: Math.max(0, Math.min(getItem(slot.item).durability ?? slot.durability, slot.durability)) } : {}) }
        : null;
    });
  }

  count(item) {
    return this.slots.reduce((sum, slot) => sum + (slot?.item === item ? slot.count : 0), 0);
  }

  canAdd(item, count = 1) {
    const def = getItem(item);
    if (!def || !Number.isInteger(count) || count < 0) return false;
    if (count === 0) return true;
    let remaining = count;
    for (const slot of this.slots) {
      if (!slot || (slot.item === item && slot.count < def.stack)) {
        const room = slot ? def.stack - slot.count : def.stack;
        remaining -= Math.min(room, remaining);
        if (remaining <= 0) return true;
      }
    }
    return false;
  }

  add(item, count = 1) {
    const def = getItem(item);
    if (!def || !Number.isInteger(count) || count < 1) return count;
    let remaining = count;
    for (const slot of this.slots) {
      if (slot?.item === item && slot.count < def.stack) {
        const moved = Math.min(def.stack - slot.count, remaining);
        slot.count += moved; remaining -= moved;
        if (!remaining) return 0;
      }
    }
    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i]) {
        const moved = Math.min(def.stack, remaining);
        this.slots[i] = { item, count: moved, ...(def.durability && moved === 1 ? { durability: def.durability } : {}) }; remaining -= moved;
        if (!remaining) return 0;
      }
    }
    return remaining;
  }

  remove(item, count = 1) {
    if (!Number.isInteger(count) || count < 1 || this.count(item) < count) return false;
    let remaining = count;
    for (let i = 0; i < this.slots.length && remaining; i++) {
      const slot = this.slots[i];
      if (slot?.item !== item) continue;
      const moved = Math.min(slot.count, remaining);
      slot.count -= moved; remaining -= moved;
      if (!slot.count) this.slots[i] = null;
    }
    return true;
  }

  hasIngredients(ingredients) {
    return Object.entries(ingredients).every(([item, count]) => this.count(item) >= count);
  }

  toJSON() {
    return this.slots.map(slot => slot ? { ...slot } : null);
  }
}

export function countIngredients(grid) {
  const counts = {};
  for (const item of grid) if (item) counts[item] = (counts[item] ?? 0) + 1;
  return counts;
}

export function isKnownItem(item) {
  return Object.hasOwn(ITEMS, item);
}
