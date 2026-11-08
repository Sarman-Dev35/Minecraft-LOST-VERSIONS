// Classic Alpha/Beta-style survival rules: health and direct food healing.
// There is intentionally no hunger bar; that mechanic belongs to later Minecraft versions.
const MAX_HEALTH = 20;
const FOOD_HEALING = Object.freeze({
  raw_porkchop: 3,
  cooked_porkchop: 8,
  bread: 5,
  apple: 4,
  mushroom_stew: 6
});

export class SurvivalState {
  constructor({ health = MAX_HEALTH, armor = 0, alive = true } = {}) {
    this.health = clampInteger(health, 0, MAX_HEALTH);
    this.armor = clampInteger(armor, 0, 20);
    this.alive = Boolean(alive) && this.health > 0;
    if (!this.alive) this.health = 0;
  }

  damage(amount, source = "unknown") {
    const value = finitePositive(amount);
    if (!this.alive || value === 0) return this.snapshot(false, source);
    const mitigated = Math.max(0, value * (1 - this.armor / 25));
    const before = this.health;
    this.health = Math.max(0, this.health - mitigated);
    this.alive = this.health > 0;
    return this.snapshot(this.health !== before, source);
  }

  heal(amount, source = "food") {
    const value = finitePositive(amount);
    if (!this.alive || value === 0) return this.snapshot(false, source);
    const before = this.health;
    this.health = Math.min(MAX_HEALTH, this.health + value);
    return this.snapshot(this.health !== before, source);
  }

  eat(itemId) {
    const healing = FOOD_HEALING[itemId] ?? 0;
    if (!healing) return { ...this.snapshot(false, "food"), consumed: false, reason: "not_food" };
    if (!this.alive) return { ...this.snapshot(false, "food"), consumed: false, reason: "player_dead" };
    if (this.health >= MAX_HEALTH) return { ...this.snapshot(false, "food"), consumed: false, reason: "health_full" };
    return { ...this.heal(healing, itemId), consumed: true, reason: null };
  }

  setArmor(points) {
    this.armor = clampInteger(points, 0, 20);
    return this.snapshot(true, "armor");
  }

  respawn() {
    this.health = MAX_HEALTH;
    this.alive = true;
    return this.snapshot(true, "respawn");
  }

  snapshot(changed = false, source = null) {
    return { health: this.health, maxHealth: MAX_HEALTH, armor: this.armor, alive: this.alive, changed, source };
  }
}

function finitePositive(value) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function clampInteger(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? Math.floor(value) : min));
}

export { MAX_HEALTH, FOOD_HEALING };
