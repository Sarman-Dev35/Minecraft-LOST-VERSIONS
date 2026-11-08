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

## Current limitations

This is an early alpha, not a complete Minecraft implementation. World persistence, survival/health, crafting grid placement, tools affecting mining speed, block drops with tool-specific rules, mobs, multiplayer, controller support, and offline dependency bundling are not implemented yet. The current recipes are instant craft buttons rather than a full grid.

## Project direction

The immediate goal is a stable, enjoyable old-school voxel sandbox. Cursed-version anomalies, the fictional lost-version archive, ARG clues, and the ENTITY storyline will be added only after the basic gameplay foundation is tested.

## Original assets

The title logo and favicon are original SVG artwork created for Sarman Studios. No Minecraft source code, official logos, textures, sound recordings, or music are included. The ambient sound is synthesized at runtime.
