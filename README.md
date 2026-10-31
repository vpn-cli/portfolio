# Creative Portfolio & Interactive Bento Hub

An Apple-grade, high-performance personal portfolio built with **Next.js 15 (App Router)**, **GSAP 3**, **React Three Fiber (R3F)**, **Lenis**, and **Tailwind CSS v4**.

Designed and engineered around a dynamic 10-tile Bento Grid, physical mass inertia, optical glass refraction, and cinematic transitions.

---

## ✨ Features & Motion Architecture

1. **Velocity-Coupled Stack Marquee (`components/tiles/StackTile.tsx`)**
   - Continuously monitors Lenis scroll velocity (`lenis.velocity`).
   - Dynamically boosts marquee scroll speed during rapid scrolls and decelerates back to cruise speed.
   - Pauses on pointer hover to allow inspecting tool badges.

2. **3D Prismatic Core (`components/three/PrismScene.tsx`)**
   - Built with React Three Fiber (`@react-three/fiber`) and Drei (`MeshTransmissionMaterial`).
   - Dynamic real-time optical glass refraction, chromatic aberration, and specular rim lighting.
   - Micro-lerped gyroscopic cursor tracking with organic float inertia.
   - Automatically pauses rendering via `IntersectionObserver` when scrolled offscreen to conserve GPU resources.

3. **Physics-Based 3D Bento Tile Tilt (`components/tiles/BentoTile.tsx`)**
   - Ultra-responsive pointer-tracked tilt using `gsap.quickTo` (`rotateX` / `rotateY` / `scale`).
   - Dynamic specular spotlight beam tracking cursor coordinates across the card surface.
   - Apple continuous squircle borders (`rounded-[32px]`) with inner top bevel illumination.

4. **SplitText Masked Typography Choreography (`components/tiles/IntroTile.tsx`)**
   - Character-level masked reveals for hero typography using custom `"apple-spring"` bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Line-level masked reveals for bio narratives and case study deep-dives.

5. **Shared-Element Flip Transition Feel (`components/tiles/ProjectTile.tsx`)**
   - Clicking any project tile captures spatial bounds and expands a card clone into the full viewport using `"cinematic-expo"` easing before transitioning to the case study route.

6. **Cinematic Route Transition Wipe (`components/motion/RouteTransition.tsx`)**
   - Dynamic clip-path polygon portal wipe in Solar Amber during client navigation, avoiding jarring flashes.

7. **Sticky Scrubbed Case Study Storytelling (`components/case-study/CaseStudyView.tsx`)**
   - Hero media dynamically scales and rounds into a framed viewport during scroll.
   - Pinned horizontal gallery track scrubbed via GSAP `ScrollTrigger`.
   - Parallax vertical image cards and sticky project metadata sidebar.

8. **Live Studio Tile (`components/tiles/LiveTile.tsx`)**
   - Real-time timezone-accurate digital clock with animated studio focus audio equalizer waveform.

9. **Haptic Contact Tile (`components/tiles/ContactTile.tsx`)**
   - One-click email copy with instant spring-settle feedback, clipboard state machine, and specular button illumination.

10. **Magnetic Social Orbit (`components/tiles/SocialTile.tsx`)**
    - High-density social links with cursor-magnetic pull (`gsap.quickTo`) and sliding label swaps.

11. **Fluid Kinetic Cursor (`components/motion/CustomCursor.tsx`)**
    - Dual-ring cursor system: pinpoint dot plus viscous follower ring that morphs and displays action labels over interactive targets.

12. **Complete Accessibility & Reduced Motion Support**
    - Strictly honors `(prefers-reduced-motion: reduce)` across GSAP timelines, Lenis smooth scrolling, Three.js animations, and 3D tilt.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🎨 Personalization & Content Configuration

All personal information, projects, case studies, tech stack, and social links are centrally configured in a single file:

👉 [`content/site.ts`](file:///content/site.ts)

Simply update the properties in `siteConfig`:
- **Name & Title**: `name`, `role`, `bio`
- **Location & Timezone**: `city`, `coordinates`, `timezone`
- **Contact & Socials**: `email`, `socials`
- **Tech Stack**: `techStack`
- **Projects & Case Studies**: `projects` array with full narrative briefs, problem/solution breakdown, metrics, and galleries.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Motion:** [GSAP 3](https://greensock.com/gsap/) (`CustomEase`, `ScrollTrigger`, `Flip`, `SplitText`)
- **Smooth Inertia:** [Lenis](https://lenis.darkroom.engineering/)
- **3D Graphics:** [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **Icons:** [Lucide React](https://lucide.dev/)

