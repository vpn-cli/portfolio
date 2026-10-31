# Design System Specification

> **Architectural & Visual Identity for Personal Portfolio**  
> *Engineered for high-end Apple-level precision, dynamic physical motion, and bespoke creative authority.*

---

## 1. Color Palette: Solar Amber & Deep Obsidian Glass

### Primary Accent
* **Accent Primary:** `Solar Amber` (`#FF6B00`) — high-energy, luminous warmth reminiscent of bespoke optical glass filters, backlit studio dials, and the Apple Ultra aesthetic.
* **Accent Glow:** `#FF8833` (subtle specular bloom and hover highlight)
* **Accent Deep:** `#E05A00` (pressed/active states)
* **Accent Tint (Subtle Fill):** `rgba(255, 107, 0, 0.08)` (delicate backdrop wash for badges and active pills)

*Alternative user options:*
* *Cyber Emerald (`#00F59B`)* — crisp oceanic terminal glow
* *Hyper Violet (`#8B5CF6`)* — deep dimensional cosmic luminescence

### Derived Neutral Palette (Graphite & Dark Obsidian Glass)
```css
/* Backgrounds */
--bg-canvas: #090A0D;             /* Ultra-deep obsidian with cool blue-black undertone */
--bg-canvas-subtle: #0F1116;      /* Ambient backdrop gradient stop */

/* Surface / Card Tokens */
--surface-tile: #13151B;          /* Base tile background */
--surface-tile-elevated: #191C24; /* Hovered / active tile state */
--surface-glass: rgba(19, 21, 27, 0.72); /* Frosted backdrop with backdrop-blur-xl */

/* Borders & Specular Micro-Bevels */
--border-subtle: rgba(255, 255, 255, 0.07);      /* Resting border stroke */
--border-hover: rgba(255, 255, 255, 0.18);       /* Tile hover edge illumination */
--border-accent: rgba(255, 107, 0, 0.55);        /* Accent interactive spotlight */
--border-inner-bevel: inset 0 1px 1px 0 rgba(255, 255, 255, 0.12); /* Apple squircle bevel */

/* Typography & Hierarchy */
--text-primary: #F5F5F7;          /* 96% luminance crisp white */
--text-secondary: #9CA1AC;        /* Balanced graphite secondary */
--text-tertiary: #5A5F6D;         /* Muted meta labels and footnotes */
--text-accent: #FF6B00;           /* High-contrast brand punch */
```

---

## 2. Typography System & Font Pairings

We offer two bespoke font systems tailored for digital craft and engineering:

### Recommended Option A: The Architectural Modernist (Cabinet Grotesk + Geist / Inter)
* **Display / Headings:** `Cabinet Grotesk` or `Syne` (Bold, wide geometric proportions, editorial authority)
* **Body / Technical / Meta:** `Geist` or `Inter` (Precise tabular Swiss geometry, clean readability at micro sizes)
* **Vibe:** Highly engineered, architectural, tech-forward, authoritative.

### Option B: The Avant-Garde Sculptural (Syne + Plus Jakarta Sans)
* **Display / Headings:** `Syne` (Expressive, wide geometric display font with avant-garde personality)
* **Body / Technical / Meta:** `Plus Jakarta Sans` (Friendly, humanist-grotesque with warm curves)
* **Vibe:** Design-agency director, bespoke creative technologist, expressive.

### Modular Size & Hierarchy Scale
* **Display Hero:** `clamp(2.75rem, 6vw, 4.5rem)` / `44px – 72px` (Line height `1.05`, Letter spacing `-0.035em`)
* **Tile Heading (H2):** `clamp(1.5rem, 3vw, 2.25rem)` / `24px – 36px` (Line height `1.15`, Letter spacing `-0.025em`)
* **Subheading / Section (H3):** `1.25rem` / `20px` (Line height `1.3`, Medium weight)
* **Body Large:** `1rem` / `16px` (Line height `1.6`, Letter spacing `-0.01em`)
* **Body Small / Caption:** `0.875rem` / `14px` (Line height `1.5`)
* **Technical Pill / Eyebrow:** `0.75rem` / `12px` (Uppercase, Letter spacing `+0.06em`, Semi-bold)

---

## 3. Geometry, Tokens & Spatial Depth

### Squircles & Radii
* **Bento Grid Cards:** `rounded-[32px]` (`2rem` / 32px continuous squircle)
* **Internal Media & Nested Containers:** `rounded-[20px]` (Preserves concentric visual nested radius rule: $R_{outer} - Padding = R_{inner}$)
* **Pills, Badges & Micro Buttons:** `rounded-full` (Seamless capsule format)

### Elevation & Lighting
```css
/* Ambient Resting Depth */
box-shadow: 
  0 10px 30px -10px rgba(0, 0, 0, 0.6),
  inset 0 1px 1px 0 rgba(255, 255, 255, 0.08);

/* Hover Kinetic Elevation */
box-shadow: 
  0 24px 60px -12px rgba(0, 0, 0, 0.8),
  0 0 32px -4px rgba(255, 107, 0, 0.18),
  inset 0 1px 2px 0 rgba(255, 255, 255, 0.16);
```

### Spacing Grid
* **Bento Gap:** `gap-4 sm:gap-5 lg:gap-6` (`16px / 20px / 24px`)
* **Tile Padding:** `p-6 sm:p-7 lg:p-8`
* **Container Width:** `max-w-7xl` (`1280px` max viewport bound, centered with fluid gutter padding `px-4 sm:px-6 lg:px-8`)

---

## 4. Custom Bento Grid Arrangement (10 Distinct Modules)

```
+-----------------------------------------------------------------------------------+
|  [TILE 1: Intro & Narrative Hook]          |  [TILE 2: 3D Prismatic Core]         |
|  "Hi, I'm [NAME]" - SplitText Mask Reveal  |  Interactive Glass Artifact (R3F)     |
|  Role, Status Beacon, Geo Coordinates      |  Cursor-tracked Gyroscopic Refraction|
|  (Col Span: 7, Row Span: 2)                |  (Col Span: 5, Row Span: 2)          |
+-----------------------------------------------------------------------------------+
|  [TILE 3: Featured Project Alpha]          |  [TILE 4: Live Time & Sound]         |
|  Flagship Case Study - FLIP-ready          |  Dynamic Clock + Sound Pulse Waveform|
|  Video/Visual Preview + Specular Beam      |  (Col Span: 4, Row Span: 1)          |
|  (Col Span: 8, Row Span: 2)                +--------------------------------------+
|                                            |  [TILE 5: About / Ethos]             |
|                                            |  Design Philosophy & Link to /about  |
|                                            |  (Col Span: 4, Row Span: 1)          |
+-----------------------------------------------------------------------------------+
|  [TILE 6: Project Beta]  |  [TILE 7: Tech Stack Marquee]  |  [TILE 8: Project Gamma]|
|  Mobile App Retrospective|  Lenis-Velocity reactive       |  3D Systems / WebGL Case|
|  (Col Span: 4, Row 2)    |  Infinite floating badges      |  (Col Span: 4, Row 2)   |
|                          |  (Col Span: 4, Row Span: 2)    |                         |
+-----------------------------------------------------------------------------------+
|  [TILE 9: Social Orbit]                    |  [TILE 10: Conversion Terminal]      |
|  Sliding Label-Swap Magnetic Pills         |  One-Click Email Copy with Tactile   |
|  GitHub, X/Twitter, LinkedIn, Substack     |  Explosion & Haptic "Copied!" State  |
|  (Col Span: 6, Row Span: 1)                |  (Col Span: 6, Row Span: 1)          |
+-----------------------------------------------------------------------------------+
```

---

## 5. Motion Language & GSAP Custom Eases

### 1. The Named Custom Eases
```typescript
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

// 1. "apple-spring": Silky, natural mass inertia with zero jarring bounce
CustomEase.create("apple-spring", "M0,0 C0.16, 1, 0.3, 1 1,1");

// 2. "snappy-micro": Immediate tactile pickup with sharp settle for micro-interactions
CustomEase.create("snappy-micro", "M0,0 C0.2, 0, 0, 1 1,1");

// 3. "cinematic-expo": Expansive, frictionless deceleration for full-bleed transitions
CustomEase.create("cinematic-expo", "M0,0 C0.22, 1, 0.36, 1 1,1");
```

### 2. Standard Motion Durations
* **Micro Interactions (hover, copy feedback, magnetic pull):** `0.2s – 0.35s` using `"snappy-micro"`
* **Card Tilt / Parallax (`gsap.quickTo`):** `0.4s` lag-smoothed interpolation
* **Grid Tile Entrance (Staggered Load):** `0.85s` using `"apple-spring"`, `0.06s` stagger
* **FLIP Expansion (Card → Hero):** `0.9s` using `"cinematic-expo"`
* **Page Route Portal Wipe:** `0.8s` clip-path wipe in Solar Amber

### 3. Accessibility & Reduced Motion
All animations are strictly bounded inside:
```typescript
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Full kinetic choreography
});
mm.add("(prefers-reduced-motion: reduce)", () => {
  // Instantaneous zero-duration opacity shifts, static transforms
});
```

