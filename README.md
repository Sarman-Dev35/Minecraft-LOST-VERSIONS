# Minecraft: LOST VERSIONS

An independent, original voxel sandbox prototype by Sarman Studios.

## Alpha 0.1.0

The first playable foundation currently includes:

- A procedurally generated block world with rolling terrain and simple trees.
- First-person mouse look and WASD movement.
- Jumping and sprinting.
- Block breaking and block placement.
- A five-slot hotbar with number-key selection.
- Main menu, pause menu, About screen, and settings.
- Adjustable music volume, mouse sensitivity, field of view, and render distance.
- Procedurally generated ambient audio using the Web Audio API (no third-party music files).
- A deliberately simple, early-alpha visual presentation.

## Run

Open `index.html` in a modern browser while connected to the internet. The game imports Three.js as an ES module from jsDelivr, so the first load requires an internet connection. For best results, serve the repository with a local static web server rather than opening the file directly.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Look around |
| Space | Jump |
| Left Shift | Sprint |
| Left mouse button | Break block |
| Right mouse button | Place selected block |
| 1–5 | Select hotbar block |
| Escape | Pause |

## Project direction

This is the clean sandbox foundation for **Minecraft: LOST VERSIONS**. The cursed-version atmosphere, anomalies, fictional lost-version lore, and ENTITY storyline will be developed in later milestones. This alpha intentionally focuses on getting the basic world and controls working first.

## Originality and disclaimer

This is an independent fan-inspired voxel project. It is not affiliated with, endorsed by, or sponsored by Mojang or Microsoft. It does not include Minecraft source code, assets, textures, sounds, or music. All current visuals are generated from original primitive geometry and materials; ambient audio is synthesized at runtime.

## Current limitations

This is an early prototype, not a complete Minecraft replacement. World saving/loading, crafting, inventory management, mobs, multiplayer, mobile support, and offline dependency bundling are not implemented yet.
