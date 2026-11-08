# MINECRAFT: The Lost Version
### An independent voxel survival sandbox by Sarman Studios

**Alpha 0.3 development build** — a classic-inspired survival prototype under active development.

> This is an independent, fan-inspired project. It is not affiliated with, endorsed by, or sponsored by Mojang or Microsoft. Minecraft is a trademark of its respective owner. Sarman Studios retains rights to its original code, logo, artwork, and original project materials.

## Playable systems in this development build

- First-person movement, mouse look, jumping, sprinting, mining and block placement.
- Procedural starter terrain with trees and simple wool-source sheep placeholders.
- Six-slot block hotbar, health display, fall damage and respawn.
- Day/night cycle with changing sky and lighting.
- Bed crafting (3 wool + 3 planks), placement, night-time sleeping and morning healing.
- 36-slot stack-aware inventory with drag-and-drop rearrangement.
- 2×2 hand crafting and 3×3 crafting when a crafting table is present in the inventory.
- Shaped and shapeless recipes use the shared recipe registry.
- Browser-local saves for terrain, inventory slots, crafting grid, player position, health, day/time and selected hotbar slot.
- Main menu, settings, pause menu and synthesized ambient audio.

## Classic survival direction

- No hunger meter: food is intended to restore health directly, following the older Alpha/Beta direction.
- Diamond is the highest equipment tier.
- No End, Ender Dragon or Netherite.
- The Nether is a later milestone, after Overworld survival is stable.
- Horror elements, ENTITY_232, cursed-world events and ARG content remain out of scope until the ordinary survival game is complete.

## Still under development — not yet a complete survival release

The current playable interface is still an early prototype. The following are not yet fully connected or gameplay-tested: tool selection and durability, ore generation and mining tiers, working furnace/fuel/smelting UI, food consumption, armor equipment, animal AI and breeding, hostile mob AI and combat, drops/loot balancing, larger streamed terrain and a complete world-management screen. Some item definitions and recipes exist as data foundations, but a registry entry alone does not mean that the feature is playable.

Sheep are currently simple static voxel placeholders, not animated animals. The crafting grid is functional but intentionally simple; item clicks move one item into the grid, and inventory slots can be rearranged by drag-and-drop.

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

The production site is generated in `dist/`. GitHub Actions runs tests, builds the Vite app and uploads a ZIP artifact named `Minecraft-LOST-VERSIONS-Alpha-0.3-dev` (14-day retention).

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Look around |
| Space | Jump |
| Left Shift | Sprint |
| Left mouse button | Mine a block / collect a wool-source sheep |
| Right mouse button | Place selected block / sleep at a bed at night |
| E | Open / close inventory |
| 1–6 | Select a hotbar block |
| Inventory click | Move one item into the crafting grid |
| Inventory drag-and-drop | Rearrange inventory slots |
| Crafting-grid click | Return one item to inventory |
| Escape | Pause / close inventory |

## Original assets

The title logo and favicon are original SVG artwork created for Sarman Studios. No Minecraft source code, official logos, textures, sound recordings, or music are included. Ambient sound is synthesized at runtime.
