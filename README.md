# Mohana Prasath G — Portfolio

Personal portfolio website showcasing projects, achievements, research, and leadership experience.

**Live:** [mohana-prasath-2005.github.io/portfolio](https://mohana-prasath-2005.github.io/portfolio/)

## Tech Stack

- **React 18** + **Vite 6**
- **Tailwind CSS 3** — single dark design system driven by tokens in `src/index.css`
- **Three.js + React Three Fiber** — persistent 3D environment (lazy-loaded)
- **Framer Motion 11** — reveals, tabs and scroll-linked effects
- **Lenis** — smooth scrolling (desktop, fine pointers only)
- **React Icons** — Simple Icons / Tabler marks for the tech stack

## Design

One dark theme only: obsidian background, charcoal surfaces with a top-lit edge, off-white type, an electric-cyan accent used sparingly and ice-blue highlights. Inter Tight for display and UI, JetBrains Mono for technical labels.

## Features

- **3D environment** behind the whole page: a procedural terrain drawn as topographic contour lines, a pointer-following light pool, and the camera gliding along the valley as you scroll
- **System stack** in the hero: the README's six technology layers as lit slabs with one module per tool (26), joined by data buses carrying packets; hover/tap a layer, or use the HTML layer picker, to inspect it
- **Case-file project showcase** with accessible tabs and an interactive architecture flow per project (built only from facts in the project/repo descriptions)
- **Tech arsenal** as circuit rails, one per layer, sourced from the GitHub profile README
- Loads text first; the WebGL chunk mounts on idle and falls back to a static backdrop without WebGL
- Reduced motion: no smooth scroll or cursor follower, static 3D render, no animated packets
- Accessible mobile menu, skip link, visible focus states, copy-to-clipboard email

## Sections

1. **Hero** — portrait, name, role, highlights, stack inspector
2. **About** — statement and spec sheet
3. **Stack** — 26 tools across 6 layers
4. **Work** — VISION X, Transaction Reconciliation, IoT Robot Car
5. **Research** — papers, hackathons, other builds
6. **Journey** — Open Fabric, NIT Trichy, education (CGPA 9.2, semester chart), certifications
7. **Leadership** — roles timeline
8. **Awards** — honours and competition record
9. **Contact** — email, phone, profiles

## Project Structure

```
src/
├── App.jsx                 # Layout: world stage, nav, sections, footer
├── index.css               # Design tokens and shared component styles
├── data/profile.js         # All portfolio content (single source of truth)
├── assets/avatar.jpg       # Optimised portrait
├── three/
│   ├── WorldStage.jsx      # WebGL detection, idle lazy-load, fallback
│   ├── World.jsx           # Terrain, motes, camera rig, stack placement
│   ├── Stack.jsx           # The 6-layer system stack (materials, buses, packets)
│   └── store.js            # Shared layer-selection state (HTML ↔ WebGL)
├── hooks/                  # useMediaQuery, useActiveSection
└── components/             # Hero, About, Skills, Projects (+ SystemFlow), Innovation,
                            # Journey (+ AcademicExcellence, Certifications), Leadership,
                            # IsteAward, CompetitionWins, Contact, Footer, Navbar, Avatar, ui/*
```

To change content, edit `src/data/profile.js`.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Deployment

Configured for GitHub Pages with `base: '/portfolio/'` in `vite.config.js`. The `npm run deploy` command builds and pushes to the `gh-pages` branch.
