# ARSHIA SWAIN — 3D PORTFOLIO

A fully explorable, first-person 3D portfolio built around the existing `Astro_Library.glb`
model. Explore applied AI projects, machine learning methods, generative AI work and computer
vision experiments, climb the spiral stair to the experience gallery, and open the contact panel
for the resume PDF.

The environment, lighting, physics and UI use React 19, Three.js, React Three Fiber, Drei, Rapier
physics, and Zustand.

## Requirements

- Node.js 18+ (tested on Node 22)
- npm 9+
- A desktop browser with WebGL 2 and Pointer Lock support (Chrome, Edge, Firefox, Safari)

## Install and run

```bash
cd Astro_Library_Website
npm install
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`). Click **ENTER PORTFOLIO**, wait for
the model to load, then click **TAKE CONTROL** to capture the mouse.

### Production build

```bash
npm run build
npm run preview
```

The preview server runs at `http://localhost:4173`.

## Controls

| Input | Action |
| --- | --- |
| `W` `A` `S` `D` | Walk |
| Mouse | Look |
| `Space` | Jump |
| `Shift` | Sprint |
| Left click | Open the glowing entry under the crosshair |
| `Esc` | Release the mouse / close a panel |
| `M` | Toggle the mini-map |
| `F` | Toggle fullscreen |
| `P` | Open settings |

Additional controls live in the pause menu, settings, and HUD. Mouse sensitivity, volume, mute,
mini-map, and head-bob can all be changed in Settings and are persisted to `localStorage`.

## What is included

- **First-person controller** — smooth accelerated movement, sprinting, jumping, gravity,
  ground detection, head bob, camera smoothing, and respawn protection.
- **Rapier physics** — a capsule character with a kinematic character controller, world-space
  trimesh colliders baked from the structural model meshes, a full cylindrical floor, and an
  invisible segmented perimeter to seal the building.
- **Portfolio interactions** — 12 project and profile entries, 7 portfolio tracks, and 3 focus
  tables. Every hotspot has a subtle holographic marker, hover feedback, a contextual HUD prompt,
  and a detailed glass information panel. Movement stays active while an entry or track panel is
  open.
- **Contact and resume** — the entrance track opens email, phone and resume links. The one-page
  PDF lives at `public/resume/Arshia_Swain_OnePager.pdf`.
- **Focus tables** — three procedural holographic tables with chairs and matching physics
  colliders. The table directly ahead of the entrance is **About & Contact**; the left table holds
  **Experience & Credentials**; the right table indexes **Projects & Toolkit**.
- **Atmosphere** — procedural ambient drones and synthesized footsteps, hover, interaction, and UI
  sounds. Audio starts only after a user gesture, and can be muted or mixed from the HUD/settings.
- **UI** — welcome screen, loading screen, control-capture screen, pause/portfolio index, settings,
  circular SVG mini-map, HUD, and animated information panels.
- **Dev collision debug** — development builds only. Enable **Collision debug** in Settings to draw
  every Rapier collider as a colored wireframe (cyan floor, green structure, magenta upper bounds).

## Portfolio content

All copy is derived from `public/resume/Arshia_Swain_OnePager.pdf`:

- **Applied AI Projects** — HomeMatch, the IBM Watson article recommender, and the dog-breed image
  classifier.
- **Machine Learning Lab** — ranking, collaborative filtering, matrix factorization, model
  evaluation and the Python data stack.
- **Generative AI Studio** — RAG, LanceDB vector search, LangChain orchestration and the grounded
  HomeMatch chatbot.
- **Computer Vision** — AlexNet, VGG and ResNet comparison, transfer learning, and accuracy/runtime
  benchmarking.
- **Experience & Credentials** — Accenture role, Udacity AI/ML for ATCI Nanodegree, hands-on
  training, and the portfolio focus.
- **Technical Toolkit** — Python, scientific Python, ML/DL frameworks, LLM tooling and Git.
- **Contact & Resume** — email, phone and one-page PDF.

The editable source for all entries, tracks and focus tables is
`src/data/librarySections.js`; panel metadata is assembled in `src/data/panelContent.js`.

## Project structure

```
Astro_Library_Website/
├─ 3D_Models/Astro_Library.glb        # original model (untouched)
├─ public/
│  ├─ models/Astro_Library.glb       # optimized runtime model
│  ├─ resume/Arshia_Swain_OnePager.pdf
│  └─ favicon.svg
├─ scripts/optimize-model.mjs        # GLB optimization pipeline
├─ src/
│  ├─ App.jsx                        # screen/overlay routing
│  ├─ main.jsx
│  ├─ audio/AudioEngine.js           # procedural Web Audio
│  ├─ components/
│  │  ├─ GameCanvas.jsx
│  │  ├─ LibraryEnvironment.jsx      # model + baked colliders
│  │  ├─ PhysicsWorld.jsx
│  │  ├─ PlayerController.jsx
│  │  ├─ ReadingAreas.jsx
│  │  ├─ InteractiveObject.jsx
│  │  ├─ InteractiveSpots.jsx
│  │  ├─ InteractionSystem.jsx
│  │  ├─ CollisionDebug.jsx
│  │  ├─ WelcomeScreen.jsx
│  │  ├─ LoadingOverlay.jsx
│  │  ├─ StartOverlay.jsx
│  │  ├─ PauseOverlay.jsx
│  │  ├─ SettingsPanel.jsx
│  │  ├─ InformationPanel.jsx
│  │  ├─ HUD.jsx
│  │  ├─ MiniMap.jsx
│  │  └─ SceneAtmosphere.jsx
│  ├─ data/                          # world constants, entries, tracks, panels
│  ├─ hooks/usePlayerControls.js
│  ├─ store/useUIStore.js
│  ├─ styles/global.css
│  ├─ styles/interface.css
│  ├─ three/interactionRegistry.js
│  └─ utils/
├─ index.html
├─ vite.config.js
└─ package.json
```

## Collision model

The original GLB is not a game-ready collision mesh. `LibraryEnvironment.jsx` walks every loaded
mesh except the decorative book meshes, dequantizes its positions, bakes each geometry into world
space, and creates 23 static Rapier trimesh colliders for the shelves, walls, mezzanine, dome,
spiral stairs, plinth, railings, globe, and entrance door. The optimized GLB uses Meshopt
quantization, so collider vertices are read into a fresh `Float32Array` before applying world
transforms; writing transformed floats back into the normalized Int16 buffer would corrupt the
collision geometry.

The 234k-triangle `Books` mesh is intentionally excluded from physics — the surrounding shelf and
wall trimeshes already block access. A cylinder collider fills the entire lower floor (including
the centre cut-out), and 32 overlapping cuboids seal the perimeter, including the entrance. The
globe, stair, mezzanine, and dome are all solid.

Movement uses Rapier's `KinematicCharacterController` with autostep (0.42 m), snap-to-ground
(0.4 m), slope limits, and impulse transfer, so the player can climb the spiral stair and explore
the upper gallery without falling through floors or clipping through shelves.

## Model optimization

The original `3D_Models/Astro_Library.glb` (74.6 MB) is left untouched. The runtime copy at
`public/models/Astro_Library.glb` (about 11.4 MB) is produced with:

```bash
npm run optimize-model
```

The script deduplicates/prunes/welds geometry, compresses textures to WebP (max 2048 px, quality
88), applies meshopt compression, and preserves node names, materials, UVs, and animation data.
The loader is configured for meshopt assets, and the scene is cached by the browser after the
first load.

## Notes

- Pointer lock is required for mouse look. If the browser rejects it, allow pointer lock for the
  site and click **Resume** again.
- `Esc` releases the mouse and opens the pause menu. Use the portfolio index there to open a track
  directly.
- Collision wireframes are shown only when `import.meta.env.DEV` is true; the setting is hidden in
  production builds.
- The 3D library model is retained as the portfolio environment; the interface and content are
  customized for Arshia Swain's resume.
