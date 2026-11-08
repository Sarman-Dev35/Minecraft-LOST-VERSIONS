# MINECRAFT: The Lost Version
### An independent voxel survival sandbox by Sarman Studios

**Alpha 0.6 development build** — a classic-inspired survival prototype under active development.

> This is an independent, fan-inspired project. It is not affiliated with, endorsed by, or sponsored by Mojang or Microsoft. Minecraft is a trademark of its respective owner. Sarman Studios retains rights to its original code, logo, artwork, and original project materials.

## Playable systems in this development build

- First-person movement, mouse look, jumping, sprinting, mining and block placement.
- Seeded classic-style Overworld with rolling hills, plains/forest variants, underground caves, coal/iron/gold/diamond/redstone/lapis ore veins, and oak/birch/pine-inspired voxel trees. The playable world can now be generated as a Large bounded region, with an optional Huge mode for stronger PCs.
- Passive animals spawn on suitable open grassland/forest clearings rather than arbitrary coordinates.
- Nine-slot inventory hotbar, health display, fall damage, respawn and slow passive health regeneration.
- Day/night cycle with changing sky and lighting.
- Bed crafting (3 wool + 3 planks), placement, night-time sleeping and morning healing.
- 36-slot stack-aware inventory with drag-and-drop rearrangement.
- 2×2 hand crafting and 3×3 crafting when a crafting table is present in the inventory.
- Shaped and shapeless recipes use the shared recipe registry.
- Mineable ore blocks with pickaxe-tier requirements and correct raw-material/gem drops.
- Working furnace interface with selectable input/fuel, timed smelting, fuel consumption, cooked beef/pork/chicken, raw iron and raw gold processing.
- Browser-local saves for terrain, inventory slots, crafting grid, player position, health, day/time, animals, dropped items and selected slots.
- Redesigned title screen with prominent MINECRAFT / THE LOST VERSION identity, matching dark forest/stone palette, responsive inventory and furnace panels, settings, pause menu and synthesized ambient audio.

## Classic survival direction

- No hunger meter: food is intended to restore health directly, following the older Alpha/Beta direction.
- Diamond is the highest equipment tier.
- No End, Ender Dragon or Netherite.
- The Nether is a later milestone, after Overworld survival is stable.
- Horror elements, ENTITY_232, cursed-world events and ARG content remain out of scope until the ordinary survival game is complete.

## Still under development — not yet a complete survival release

The current playable interface is still an early prototype. The following are not yet fully connected or gameplay-tested: armor equipment and mitigation, animal breeding, hostile mob AI and combat, chunk-streamed infinite terrain, water/river systems, advanced world management, and full browser/device gameplay QA. The current generated world is intentionally a large bounded procedural region rather than an infinite world. Its edge is marked by a visible, unbreakable border wall so players cannot leave the generated map. Some item definitions and recipes exist as data foundations, but a registry entry alone does not mean that the feature is playable.

Animals currently use simple original voxel models and basic wandering AI. Left-click them to attack; cows drop raw beef and leather, pigs drop raw pork, chickens drop raw chicken and feathers, and sheep drop wool. Loot appears in the world and can be collected by walking close to it. The nine-slot hotbar is backed by inventory slots 1–9. Left-click attacks animals or mines blocks; swords and axes deal more damage than bare hands and lose durability. Right-click places the selected block, uses a bed, opens a furnace, or eats selected food. Raw iron and raw gold, along with raw meat, can be smelted using fuel; coal, charcoal, logs, planks and sticks have different burn times. Q drops one selected item, and walking over drops collects them. Food restores health directly (there is no hunger bar), and health slowly regenerates by one half-heart every 30 seconds. These are foundational systems; animal pathfinding, breeding and advanced livestock behavior are not implemented yet. The crafting grid is functional but intentionally simple; item clicks move one item into the grid, and inventory slots can be rearranged by drag-and-drop.

## Open-source research and licensing

Development research uses public documentation and license information from projects such as [Luanti](https://github.com/luanti-org/luanti) and [Terasology](https://github.com/MovingBlocks/Terasology) for general architecture ideas only. No third-party game source code, textures, sounds or assets have been copied into this repository. Any future code or asset reuse must be reviewed file-by-file for its exact license and attribution requirements.

## Run locally

Requires Node.js 20+ (Node.js 22 recommended).

```bash
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`).

## Test and build

```bash
npm install
npm test
npm run build
npm run preview
```

The production site is generated in `dist/`. GitHub Actions runs tests, builds the Vite app and uploads a ZIP artifact named `Minecraft-LOST-VERSIONS-Alpha-0.6-dev` (14-day retention).

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Look around |
| Space | Jump |
| Left Shift | Sprint |
| Left mouse button | Attack an animal / mine a block |
| Right mouse button | Eat selected food / place selected block / use bed |
| E | Open / close inventory |
| 1–9 | Select a hotbar item |
| Right-click inventory slot / Shift-click | Select an inventory item |
| Right-click with food selected | Eat the selected food item |
| Q | Drop one selected inventory item |
| Walk near a dropped item | Pick it up |
| Inventory click | Move one item into the crafting grid |
| Inventory drag-and-drop | Rearrange inventory slots |
| Crafting-grid click | Return one item to inventory |
| Escape | Pause / close inventory |

## Original assets

The title logo and favicon are original SVG artwork created for Sarman Studios. No Minecraft source code, official logos, textures, sound recordings, or music are included. Ambient sound is synthesized at runtime.
