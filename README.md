# MINECRAFT: The Lost Version
### An independent voxel sandbox by Sarman Studios

**Alpha 0.3 development build** — expanding the playable browser prototype toward a complete classic-era survival sandbox.

> This is an independent, fan-inspired project. It is not affiliated with, endorsed by, or sponsored by Mojang or Microsoft. Minecraft is a trademark of its respective owner. Sarman Studios retains rights to its original code, logo, artwork, and original project materials.

## Original playable prototype features

- Procedurally generated block terrain, trees, and a sky/fog atmosphere.
- First-person controls, jumping, sprinting, mining, and block placement.
- Resource collection: grass, dirt, stone, wood, and leaves.
- Inventory screen with live item counts.
- Starter crafting recipes:
  - 1 Wood → 4 Planks
  - 2 Planks → 4 Sticks
  - 4 Planks → 1 Crafting Table
  - 3 Planks + 2 Sticks → 1 Wooden Pickaxe
- Main menu with an original Sarman Studios / The Lost Version title logo.
- Settings for music volume, mouse sensitivity, field of view, and render distance.
- Pause menu and synthesized ambient audio.

## Playable survival systems in the current development branch\n\n- A six-slot block hotbar with a placeable bed.\n- Sheep-like wool sources in the generated world; mine them to collect wool.\n- Bed crafting (3 wool + 3 planks) and sleeping at night to advance to morning and restore a small amount of health.\n- A day/night cycle with changing sky and lighting.\n- Health display and fall damage.\n- Browser-local world saves: terrain changes, inventory, player position, health, day and selected hotbar slot are restored when returning to the world.\n\nThese are early integrations and still need hands-on browser testing. The sheep are currently simple voxel placeholders, not animated mobs.\n\n## Alpha 0.3 development foundation

The following reusable systems are now being built and tested separately before they are connected to the playable interface:

- Stable item registry for classic materials, ores, tools, armor, food, utility items, and Nether materials. Diamond is the top equipment tier; there is no Netherite or End content.
- Stack-aware 36-slot inventory core with item validation and overflow handling.
- Data-driven shaped and shapeless crafting recipes for 2×2 and 3×3 grids, including mirrored and rotated patterns.
- Starter smelting recipe registry for the future furnace interaction.
- **Classic survival rules:** 20 health points, armor damage reduction, direct food-based healing, death and respawn. There is deliberately no hunger meter, matching the old Alpha/Beta-era direction.
- **Deterministic terrain generation:** seed-based height and biome queries, grass/dirt/stone/sand layers, cave openings, and classic coal/iron/gold/redstone/lapis/diamond ore bands.
- Automated Node.js regression tests for inventory, crafting, recipe integrity, survival rules, and terrain determinism.

Important: these systems are development modules, not all integrated into the running game yet. Some systems are now connected to the playable interface, but the game is still an experimental development build, not a complete survival release.

## Current limitations

This is an early alpha, not a complete Minecraft-like survival game. The new crafting grid, survival/health HUD, terrain generator, tool-aware mining and drops, furnace interaction, world persistence, mobs, Nether travel, and full block/item interaction still require integration and gameplay testing. The original starter recipes remain simple instant-craft buttons; a full grid-based crafting interface, furnace, combat, passive/hostile mob AI, tool durability and broader survival progression still need implementation.

## Project direction

The target is a nostalgic Alpha/Beta-inspired sandbox: classic Overworld survival, diamond as the highest equipment tier, and a Nether as a later optional dimension. No End, Ender Dragon, Netherite, modern hunger meter, cursed-world events, ARG clues, or ENTITY storyline will be added until the ordinary survival game is complete and stable.

## Open-source research and licensing

Development research uses public project documentation and license information from projects such as [Luanti](https://github.com/luanti-org/luanti) and [Terasology](https://github.com/MovingBlocks/Terasology) for general architecture ideas only. No third-party game source code or assets have been copied into this repository. Any future code or asset reuse must be reviewed file-by-file for its exact license and attribution requirements. The project uses its own implementation and original Sarman Studios materials.

## Run locally

Requires Node.js 20+ (Node.js 22 recommended).

```bash
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`).

## Create a production build

```bash
npm install
npm test
npm run build
npm run preview
```

The production site is generated in `dist/`.

Every push to any branch, and every manual workflow dispatch, starts **Actions → Build Alpha**. A successful run publishes a downloadable ZIP artifact named `Minecraft-LOST-VERSIONS-Alpha-0.3-dev` (retained for 14 days). The artifact name remains 0.2.0 because the new systems are not yet integrated into a playable Alpha 0.3 release.

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Look around |
| Space | Jump |
| Left Shift | Sprint |
| Left mouse button | Mine a block |
| Right mouse button | Place selected block (requires that block in inventory) |
| E | Open / close inventory |
| 1–5 | Select a block type |
| Escape | Pause / close inventory |

## Original assets

The title logo and favicon are original SVG artwork created for Sarman Studios. No Minecraft source code, official logos, textures, sound recordings, or music are included. The ambient sound is synthesized at runtime.
