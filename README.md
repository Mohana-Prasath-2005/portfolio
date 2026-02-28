# Mohana Prasath G — Portfolio

Personal portfolio website showcasing projects, achievements, research, and leadership experience.

**Live:** [mohana-prasath-2005.github.io/portfolio](https://mohana-prasath-2005.github.io/portfolio/)

## Tech Stack

- **React 18** — Component-based UI
- **Vite 6** — Build tooling and dev server
- **Tailwind CSS 3** — Utility-first styling
- **Framer Motion 11** — Scroll-triggered and entrance animations
- **Lenis** — Butter-smooth scroll engine
- **React Icons** — Icon library

## Features

- Animated preloader with progress counter
- Lenis smooth scrolling with inertia
- Interactive particle background with aurora waves and mouse tracking
- Custom glowing cursor with hover-aware ring (desktop)
- Cursor sparkle trail with cyan/violet particles
- Floating geometric shapes with scroll-based parallax
- 3D tilt cards and mouse-following spotlight effect on all cards
- Matrix-style text scramble decode on section titles
- Magnetic hover buttons and UIverse-style animated border CTAs
- Typing animation cycling through roles
- Character-by-character staggered name reveal
- Infinite marquee ticker for skills
- Animated rotating gradient borders on stat cards
- Counter glow pulse effect on competition stats
- Highlighted keywords in hero description
- Animated CGPA counter and semester bar chart
- Scroll progress bar and active section indicator in navbar
- Fully responsive — mobile, tablet, and desktop
- Noise texture overlay and morphing background blobs

## Sections

1. **Hero** — Name, roles, bio, CTAs, social links
2. **Awards** — ISTE Best Student, Best Co-Curricular Student, NIT Trichy Internship
3. **Career Milestones** — Open Fabric (Singapore), Cognizant placements
4. **Featured Projects** — Vision X, Transaction Reconciliation, IoT Robot Car
5. **Innovation & Research** — Projects, research papers, hackathons
6. **Competition Dominance** — Stats counters and key wins
7. **Leadership & Governance** — 4-year progression of roles (Student Secretary, Board of Studies Member, Overall Students Joint Secretary, Promotional Team Head, Executive Member, Core Member)
8. **Academic Excellence** — CGPA trend, HSC/SSLC scores
9. **Certifications** — NPTEL, Microsoft, Infosys, HackerRank credentials
10. **Tech Arsenal** — Skills across 4 categories with infinite marquee
11. **Contact** — Email, phone, GitHub, LinkedIn, LeetCode, HackerRank

## Project Structure

```
src/
├── App.jsx                    # Root layout with preloader, cursor, sections
├── main.jsx                   # React entry point
├── index.css                  # Tailwind config, custom animations, button styles
└── components/
    ├── Navbar.jsx             # Fixed nav with active section indicator
    ├── Hero.jsx               # Landing section with particles and typing effect
    ├── IsteAward.jsx          # Awards showcase (3 highlight banners)
    ├── CareerMilestones.jsx   # Placement cards
    ├── Projects.jsx           # Featured project case studies
    ├── Innovation.jsx         # Projects grid, research, hackathons
    ├── CompetitionWins.jsx    # Stats counters and wins list
    ├── Leadership.jsx         # Leadership roles timeline
    ├── AcademicExcellence.jsx # CGPA chart and scores
    ├── Certifications.jsx     # Certification cards
    ├── Skills.jsx             # Tech stack grid with infinite marquee
    ├── Contact.jsx            # Contact cards and Say Hello CTA
    ├── ParticleBackground.jsx # Canvas-based interactive particles
    ├── CustomCursor.jsx       # Glowing cursor with hover ring
    ├── CursorTrail.jsx        # Sparkle particle trail on mouse move
    ├── Preloader.jsx          # Animated loading screen
    ├── ScrollProgress.jsx     # Top scroll progress bar
    ├── SmoothScroll.jsx       # Lenis smooth scroll integration
    ├── FloatingShapes.jsx     # Parallax geometric decorations
    ├── InfiniteMarquee.jsx    # Auto-scrolling ticker component
    ├── SpotlightCard.jsx      # Mouse-following radial spotlight
    ├── TiltCard.jsx           # 3D perspective tilt on hover
    ├── TextScramble.jsx       # Matrix-style text decode effect
    └── MagneticButton.jsx     # Cursor-attracted button wrapper
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Configured for GitHub Pages with `base: '/portfolio/'` in `vite.config.js`.
