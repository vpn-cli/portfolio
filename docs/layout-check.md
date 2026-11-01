# Portfolio Home Page: Layout Check & Visual Verification

## Final 12-Column Grid Map

```
========================================================================================================================
ROW 1:  [       Intro (5 cols)       ] [ Project A: LLMS.txt (3) ] [ Project B: Sockets (2) ] [   Socials (2 cols / 3x2)   ]
------------------------------------------------------------------------------------------------------------------------
ROW 2:  [ Portrait (2) ] [     About (4 cols)     ] [      Project C: AppForge (4 cols)      ] [    Resources (2 cols)      ]
------------------------------------------------------------------------------------------------------------------------
ROW 3:  [     Newsletter (5 cols)    ] [    Stack (3 cols)    ] [  Theme (2 cols)  ] [    Contact (2 cols)      ]
========================================================================================================================
```

### Proportions & Specifications
- **Container**: `width: calc(100vw - 48px); max-width: 1900px; margin: 24px auto; padding: 16px; border-radius: 32px; background: #0f0f0f; border: 1px solid rgba(255,255,255,.06)`
- **Grid Calculation**: `grid-auto-rows: calc((100vh - 48px - 32px - 2 * 16px) / 3)`
- **Single-Viewport Fit**: Fits completely inside 1920×1080 and 1440×900 with zero scrollbar and 24px margins.
- **Monochrome Theme**: `#0b0b0b` page, `#151515` tiles, `#f2f2f2` primary, `#8a8a8a` secondary text.
- **Featured GitHub Projects**:
  1. **Project A (3×1)**: [LLMS.txt Checker](https://github.com/vpn-cli/llms_txt_checker) (`/work/llms-txt`) - Technical auditing and AEO validation tool for AI crawler discoverability.
  2. **Project B (2×1)**: [Sockets Engine](https://github.com/vpn-cli/sockets) (`/work/sockets`) - Real-time low-latency WebSocket broadcasting server built with Node.js and `ws`.
  3. **Project C (4×1)**: [AppForge](https://github.com/vpn-cli/appforge) (`/work/appforge`) - AI-native metadata-driven generative web app runtime powered by Llama-3.3-70B, Supabase, and Kafka.
- **Project Tiles**: Full-bleed photos (`object-cover`), no text, hover scale 1.05 and corner arrow fade-in.
- **Socials**: 6 separate square tiles in a 3×2 grid (X, GitHub [@vpn-cli](https://github.com/vpn-cli), LinkedIn, Dribbble, Instagram, Mail).
- **Stack**: "Stack I use" + 72px rounded logo squares with infinite marquee and edge fade mask.
- **Theme Toggle**: Centered pill toggle with GSAP flip.
- **Contact**: "Have a project in mind?" + full-width "Copy email" button (1.8s timeout).

---

## Comparison: Target Reference vs. Current Build (1920×1080)

![Target vs Current Build](/public/comparisons/comparison-1920.png)

---

## Responsive Viewports

### 1. Desktop (1920×1080)
![1920x1080 Viewport](/public/screenshots/screenshot-1920.png)

### 2. Desktop (1440×900)
![1440x900 Viewport](/public/screenshots/screenshot-1440.png)

### 3. Tablet Landscape (1024×768 - 6 Columns)
![1024x768 Viewport](/public/screenshots/screenshot-1024.png)

### 4. Tablet Portrait (768×1024 - 2 Columns)
![768x1024 Viewport](/public/screenshots/screenshot-768.png)

### 5. Mobile (390×844 - 1 Column)
![390x844 Viewport](/public/screenshots/screenshot-390.png)
