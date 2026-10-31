export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  client: string;
  role: string;
  timeline: string;
  deliverables: string[];
  metrics: string[];
  accentGradient: string;
  overview: string;
  problem: string;
  process: string;
  solution: string;
  keyInsights: string[];
  gallery: {
    title: string;
    description: string;
    aspectRatio: string;
    accent: string;
  }[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
}

export interface Service {
  number: string;
  title: string;
  description: string;
}

export const siteConfig = {
  // === PERSONAL IDENTITY (Replace these placeholders) ===
  name: "Alex Vance", // [NAME] - Your full name
  role: "Creative Technologist & Motion Engineer", // [ROLE] - Your professional discipline
  city: "San Francisco", // [MY CITY] - Your base city
  timezone: "America/Los_Angeles",
  status: "Available for Q1/Q2 Projects",
  coordinates: "37.7749° N, 122.4194° W",
  bio: "Crafting digital kinetic sculptures, tactile interfaces, and spatial software experiences that live at the intersection of mathematical precision and human emotion.",
  email: "alex@alexvance.design", // [EMAIL] - Your contact email
  socials: [
    { label: "GitHub", handle: "@alexvance", url: "https://github.com" },
    { label: "X / Twitter", handle: "@alexvance_dev", url: "https://twitter.com" },
    { label: "LinkedIn", handle: "/in/alexvance", url: "https://linkedin.com" },
    { label: "ReadCV", handle: "@alexvance", url: "https://read.cv" },
  ],
  techStack: [
    { name: "Next.js", category: "Framework", highlight: "App Router" },
    { name: "TypeScript", category: "Language", highlight: "Strict" },
    { name: "GSAP", category: "Motion", highlight: "Flip & ScrollTrigger" },
    { name: "Three.js", category: "3D Graphics", highlight: "WebGL" },
    { name: "React Three Fiber", category: "3D", highlight: "R3F / Drei" },
    { name: "Tailwind CSS v4", category: "Styling", highlight: "CSS Next" },
    { name: "Lenis", category: "Physics", highlight: "Smooth Inertia" },
    { name: "GLSL Shaders", category: "Graphics", highlight: "Custom Materials" },
    { name: "Figma", category: "Design", highlight: "Tokens & Auto-Layout" },
    { name: "Web Audio API", category: "Sound", highlight: "Synthesizer" },
  ],

  // === PROJECTS & CASE STUDIES ===
  projects: [
    {
      slug: "lumina",
      title: "Lumina Spatial OS",
      tagline: "Next-generation ambient spatial computing surface with volumetric gesture dynamics.",
      category: "Spatial Interface & WebGL",
      year: "2026",
      client: "Lumina Autonomous Labs",
      role: "Lead Creative Technologist",
      timeline: "6 Months",
      deliverables: ["Spatial Design System", "Refractive Shader Pipeline", "Volumetric Gesture Core", "Haptic Soundscape"],
      metrics: ["60fps solid on mobile Safari", "140K+ Weekly active sessions", "Awwwards Site of the Year 2026"],
      accentGradient: "from-amber-500/30 via-orange-600/20 to-black",
      overview: "Lumina is a spatial operating surface designed to dismantle flat desktop paradigms. Constructed around optical glass refraction, physical mass inertia, and procedural lighting, it provides an intuitive digital studio environment.",
      problem: "Traditional computing environments force multi-dimensional concepts into rigid rectangular windows, causing sensory fragmentation and visual fatigue during deep creative sessions.",
      process: "Engineered 18 procedural glass materials, optimized low-drawcall GLSL shaders, and developed custom physics-based scroll choreography synchronized with hardware display refresh rates.",
      solution: "A kinetic workspace where windows float with genuine refractive optical depth, fluidly responding to user inertia, gaze velocity, and tactile gesture dynamics.",
      keyInsights: [
        "Physical inertia curves reduce cognitive fatigue by 34% compared to linear transitions.",
        "Refractive chromatic aberration guides visual focus toward active interaction regions.",
        "Zero-latency WebGL draw loops keep interaction perception beneath the human tactile threshold (8ms)."
      ],
      gallery: [
        {
          title: "Refractive Monolith Viewport",
          description: "Real-time volumetric lighting refracting through double-thick optical glass panes.",
          aspectRatio: "aspect-[16/10]",
          accent: "#FF6B00"
        },
        {
          title: "Spatial Layering Hierarchy",
          description: "Z-axis separation system with adaptive depth blur based on cursor focus distance.",
          aspectRatio: "aspect-[4/3]",
          accent: "#FFAE42"
        },
        {
          title: "Kinetic Gesture Palette",
          description: "Fluid radial selector responding to micro-velocity flick inputs.",
          aspectRatio: "aspect-[16/9]",
          accent: "#E05A00"
        },
        {
          title: "Ambient Dark Field Mode",
          description: "Ultra-low power OLED telemetry HUD for dim studio conditions.",
          aspectRatio: "aspect-[21/9]",
          accent: "#FF4500"
        }
      ]
    },
    {
      slug: "chronos",
      title: "Chronos Sound Studio",
      tagline: "Real-time generative audio-visual synthesizer for avant-garde sonic directors.",
      category: "Creative Audio & WebGL",
      year: "2025",
      client: "Chronos Sound Labs",
      role: "Full-Stack Creative Engineer",
      timeline: "4 Months",
      deliverables: ["Web Audio DSP Engine", "Real-Time Spectrum Visualizer", "Kinetic Control Surface", "Hardware MIDI Sync"],
      metrics: ["Sub-5ms Audio Latency", "Adopted by 40+ Grammy sound designers", "FWA of the Month"],
      accentGradient: "from-orange-500/25 via-amber-700/15 to-black",
      overview: "Chronos bridges music production and generative visual art. It parses live polyphonic audio input in real-time, translating harmonic frequencies into dynamic GPU particle fields and kinetic typography.",
      problem: "Digital audio workstations feature dense, intimidating grid interfaces that detach artists from spontaneous acoustic intuition.",
      process: "Created custom Web Audio API worklets for real-time Fourier transform processing, feeding audio buffer data directly into Three.js vertex shaders.",
      solution: "A tactile, organic sound sculpture interface where modulation feels as direct and expressive as playing a physical acoustic instrument.",
      keyInsights: [
        "Audio-reactive visual feedback reinforces muscle memory during live improvisation.",
        "Direct GPU buffer binding bypassed CPU bottlenecks for 120Hz smooth rendering.",
        "Minimalist bento controls boosted session duration by 48% over classic DAW views."
      ],
      gallery: [
        {
          title: "Harmonic Resonance Sphere",
          description: "Procedural vertex displacement mapped dynamically to bass and sub-bass frequencies.",
          aspectRatio: "aspect-[16/10]",
          accent: "#FF7A00"
        },
        {
          title: "Kinetic Frequency Envelope",
          description: "Interactive spline-based ADSR envelope editor with spring-damped control points.",
          aspectRatio: "aspect-[4/3]",
          accent: "#FF9020"
        },
        {
          title: "Live Spectral Ribbon",
          description: "Continuous horizontal audio waterfall capturing acoustic room timbre in real-time.",
          aspectRatio: "aspect-[21/9]",
          accent: "#D95000"
        }
      ]
    },
    {
      slug: "apex",
      title: "Apex Hypercar Cockpit",
      tagline: "Ultra-low latency HMI telemetry interface and digital cluster for electric hypercars.",
      category: "Automotive HMI & Systems",
      year: "2025",
      client: "Apex Electric Dynamics",
      role: "HMI Design & Motion Lead",
      timeline: "5 Months",
      deliverables: ["Digital Instrument Cluster", "Track Telemetry System", "High-G Ergonomic Modes", "HUD Vector Shaders"],
      metrics: ["8ms Glass-to-Glass Latency", "Zero Phantom Touches in 2.5G Turn", "Red Dot Best of the Best 2025"],
      accentGradient: "from-amber-600/30 via-red-900/15 to-black",
      overview: "Apex is an instrument cluster and telemetry dashboard crafted for an all-electric track hypercar. It balances immediate glanceability at 200+ mph with deep engineering diagnostic capabilities.",
      problem: "Standard touchscreens in performance vehicles cause dangerous cognitive distraction and are impossible to operate under high cornering lateral Gs.",
      process: "Conducted simulated track tests with racing drivers, optimizing letterforms, contrast thresholds, and tactile peripheral motion triggers.",
      solution: "A dual-mode adaptive cluster: at cruising speeds, full telemetry is accessible; at track speed, unnecessary data collapses into a focused high-contrast velocity and torque-vectoring arc.",
      keyInsights: [
        "High-contrast perimeter peripheral glow conveys critical engine temperature without central vision deviation.",
        "Monospaced high-legibility numerals allow glance readings in less than 150 milliseconds.",
        "Predictive torque slip visualization gave drivers 0.2s faster corner recovery response."
      ],
      gallery: [
        {
          title: "Track Combat Mode",
          description: "High-contrast stripped cockpit HUD highlighting apex speed, brake bias, and battery discharge.",
          aspectRatio: "aspect-[16/10]",
          accent: "#FF5500"
        },
        {
          title: "Torque Vectoring Matrix",
          description: "Four-wheel independent power distribution visualized as a kinetic force polygon.",
          aspectRatio: "aspect-[4/3]",
          accent: "#FF8C38"
        },
        {
          title: "Thermal Telemetry Stream",
          description: "Real-time regenerative braking and battery cell temperature gradient heat map.",
          aspectRatio: "aspect-[21/9]",
          accent: "#CC4400"
        }
      ]
    }
  ] as Project[],

  // === ABOUT PAGE & EXPERIENCE ===
  about: {
    heroStatement: "I design and engineer digital systems that honor the physics of materials, the rhythm of typography, and the clarity of spatial reasoning.",
    philosophy: [
      {
        title: "Physicality in the Digital",
        content: "Software shouldn't feel like weightless pixels on cold glass. When interfaces incorporate mass, inertia, friction, and optical refraction, they speak the sensory language our brains evolved to navigate."
      },
      {
        title: "Engineering as Craft",
        content: "Great motion cannot be handed off in a static Figma file. It is discovered in the browser, tuned with mathematical eases, smoothed with hardware tickers, and tested across real devices until it feels completely effortless."
      },
      {
        title: "Radical Restraint",
        content: "Every millimeter of padding, every millisecond of transition, and every degree of specular angle must serve a deliberate cognitive purpose. If an effect distracts from the core content, it is discarded."
      }
    ],
    experience: [
      {
        period: "2024 — Present",
        role: "Principal Creative Technologist",
        company: "Vance Autonomous Studio",
        description: "Directing spatial software systems, interactive WebGL brand experiences, and custom physics motion frameworks for global tech innovators."
      },
      {
        period: "2022 — 2024",
        role: "Senior Interaction Engineer",
        company: "Kinetic Labs",
        description: "Architected high-performance WebGL graphics pipelines, design system tokens, and micro-interaction libraries serving 10M+ users."
      },
      {
        period: "2020 — 2022",
        role: "Product Designer & Frontend Specialist",
        company: "Monolith Interactive",
        description: "Built experimental editorial interfaces, creative tooling, and responsive bento grid showcases."
      }
    ] as Experience[],
    services: [
      {
        number: "01",
        title: "Creative Direction & Art Direction",
        description: "Defining distinctive brand identities, editorial visual rhythm, and high-impact digital experiences."
      },
      {
        number: "02",
        title: "Interaction Engineering & GSAP Motion",
        description: "Architecting buttery-smooth 120fps motion systems, shared-element FLIP transitions, and velocity-synced physics."
      },
      {
        number: "03",
        title: "3D WebGL & Creative Shaders",
        description: "Building interactive Three.js/R3F scenes, procedural glass shaders, and dynamic lighting environments."
      },
      {
        number: "04",
        title: "Design Systems & Token Architecture",
        description: "Translating brand geometry, type scales, and motion tokens into modular, robust Tailwind & React codebases."
      }
    ] as Service[]
  }
};

