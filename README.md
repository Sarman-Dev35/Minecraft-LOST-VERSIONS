# MINECRAFT: The Lost Version
### An independent voxel sandbox by Sarman Studios

**Alpha 0.2.0** — an early playable browser prototype and the foundation for the LOST VERSIONS project.

> This is an independent, fan-inspired project. It is not affiliated with, endorsed by, or sponsored by Mojang or Microsoft. Minecraft is a trademark of its respective owner. Sarman Studios retains rights to its original code, logo, artwork, and original project materials.

## Alpha 0.2.0 features

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
- Vite production build and GitHub Actions ZIP artifact.

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

Every push to `main`, and every manual workflow dispatch, starts **Actions → Build Alpha**. A successful run publishes a downloadable ZIP artifact named `Minecraft-LOST-VERSIONS-Alpha-0.2.0` (retained for 14 days).

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

## Development foundation in progress (Alpha 0.3)

The codebase now has the first modular gameplay foundation in `src/game/`:

- A stable item registry with classic wood/stone/iron/gold/diamond equipment, armor, utility items, ores, and Nether materials.
- A stack-aware inventory core with item validation and overflow handling.
- Data-driven shaped and shapeless recipes for 2×2 and 3×3 crafting, including mirrored and rotated patterns.
- A starter smelting recipe registry for the future furnace system.
- Automated Node.js tests for inventory stacking, crafting, recipe matching, and recipe data integrity (`npm test`).

These modules are currently a development foundation and are not yet connected to the in-game inventory interface. The playable interface remains the Alpha 0.2.0 prototype until integration and testing are complete.

## Current limitations

This is an early alpha, not a complete Minecraft implementation. World persistence, survival/health, interactive crafting-grid UI, furnace interaction, tool-aware mining and drops, mobs, multiplayer, and controller support are not implemented yet. The current in-game recipes are still instant craft buttons; the new grid-based crafting engine is not connected to the interface yet.

## Project direction

The immediate goal is a stable, enjoyable old-school voxel sandbox. Cursed-version anomalies, the fictional lost-version archive, ARG clues, and the ENTITY storyline will be added only after the basic gameplay foundation is tested.

## Original assets

The title logo and favicon are original SVG artwork created for Sarman Studios. No Minecraft source code, official logos, textures, sound recordings, or music are included. The ambient sound is synthesized at runtime.
