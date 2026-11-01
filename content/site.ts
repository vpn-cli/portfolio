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
  image: string;
  overview: string;
  problem: string;
  process: string[];
  solution: string;
  keyInsights: string[];
  deviceType: "phone-dark" | "phone-light" | "laptop" | "3d";
  liveUrl?: string;
  screens?: {
    title: string;
    description: string;
  }[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  type: string;
  price: string;
  isFree: boolean;
  description: string;
  features: string[];
  previewUrl: string;
  downloadUrl: string;
  gradient: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
}

export const siteConfig = {
  // === PERSONAL IDENTITY ===
  name: "Vipin Kaushik",
  firstName: "Vipin",
  role: "Full-Stack Developer & Creative Technologist",
  city: "New Delhi",
  country: "India",
  avatar: "/avatar.jpg",
  timezone: "Asia/Kolkata",
  status: "Available for Select Projects",
  bio: "Engineering high-concurrency cloud systems, distributed architectures, and tactile user interfaces that feel physically alive.",
  email: "vipinkaushik20771041@gmail.com",
  story: "Ever since I wrote my first lines of code, I've had a deep passion for software engineering. I was fascinated by how logic, algorithms, and thoughtful design combine into interactive software that millions can use seamlessly.",
  whatIDoNow: "Today I engineer scalable full-stack applications, modern microservices, and buttery-smooth frontend web applications with Next.js, TypeScript, and high-performance WebGL.",
  whatIDoBest: {
    title: "Full-Stack Development",
    description: "Architecting resilient backend microservices, performant databases, and delightful frontend interfaces built with modern web standards.",
  },

  // === SOCIAL PLATFORMS (3x2 Grid on Hub) ===
  socials: [
    { label: "X / Twitter", handle: "@vipin_dev", url: "https://twitter.com", icon: "twitter" },
    { label: "GitHub", handle: "vpn-cli", url: "https://github.com/vpn-cli", icon: "github" },
    { label: "LinkedIn", handle: "vipin-kaushik", url: "https://linkedin.com", icon: "linkedin" },
    { label: "Dribbble", handle: "@vipin", url: "https://dribbble.com", icon: "dribbble" },
    { label: "Instagram", handle: "@vipin.codes", url: "https://instagram.com", icon: "instagram" },
    { label: "Email", handle: "vipinkaushik20771041@gmail.com", url: "mailto:vipinkaushik20771041@gmail.com", icon: "mail" },
  ],

  // === TECH STACK (Exact app icons matching reference) ===
  techStack: [
    { name: "Next.js", icon: "nextjs", category: "Framework", color: "#FFFFFF" },
    { name: "React", icon: "react", category: "Frontend", color: "#61DAFB" },
    { name: "TypeScript", icon: "typescript", category: "Language", color: "#3178C6" },
    { name: "Node.js", icon: "nodejs", category: "Runtime", color: "#339933" },
    { name: "Tailwind", icon: "tailwind", category: "Styling", color: "#06B6D4" },
    { name: "Three.js", icon: "threejs", category: "Graphics", color: "#FFFFFF" },
    { name: "GSAP", icon: "gsap", category: "Motion", color: "#88CE02" },
    { name: "PostgreSQL", icon: "postgres", category: "Database", color: "#4169E1" },
    { name: "Docker", icon: "docker", category: "DevOps", color: "#2496ED" },
    { name: "Figma", icon: "figma", category: "Design", color: "#F24E1E" },
  ],

  // === PROJECTS & CASE STUDIES ===
  projects: [
    {
      slug: "llms-txt",
      title: "LLMS.txt Checker",
      tagline: "Technical auditing & Answer Engine Optimization (AEO) tool for AI crawlers.",
      category: "AI Agent Tooling & Verification",
      year: "2026",
      client: "Open Source / GitHub",
      role: "Creator & Lead Architect",
      timeline: "Ongoing",
      deliverables: ["AST Markdown Parser", "Concurrent URL Crawler", "Soft-404 & SPA Detector", "10-Point AEO Heuristic"],
      metrics: ["Deterministic AST Parsing", "Bounded 5MB Stream Safety", "10-Point AEO Quality Heuristic"],
      accentGradient: "from-zinc-900 via-neutral-900 to-black",
      image: "/projects/llms-txt.jpg",
      overview: "I built this checker to answer a simple, practical question: if an AI crawler discovers your website through its llms.txt file, is that file actually usable? The tool cuts through ambiguity to verify if a site's implementation is structurally sound, machine-readable, and fundamentally useful to an agentic system.",
      problem: "A URL returning a 200 OK doesn't mean much on its own. Empty Single-Page App (SPA) shells and soft-404 templates often return 200 headers while presenting zero readable content to AI web crawlers.",
      process: [
        "Constructed an AST parser using unified and remark-parse to validate Markdown hierarchy without fragile regex.",
        "Built a controlled concurrent URL crawler utilizing p-limit with bounded stream limits to prevent crawler exhaustion.",
        "Engineered soft-404 detection that compares llms.txt responses against randomized non-existent paths.",
        "Formulated a deterministic 10-point AEO heuristic measuring evidence attribution, statistics, and verifiable quotations.",
      ],
      solution: "A technical auditing platform that validates authenticity, checks HTTP resolutions, inspects DOM payloads with Cheerio, and generates prioritized technical fix reports.",
      keyInsights: [
        "Over 40% of tested domains return soft-404 SPA shells falsely classified as successful.",
        "AST-based validation catches nested link syntax errors invisible to basic text scanners.",
      ],
      deviceType: "phone-dark",
      liveUrl: "https://github.com/vpn-cli/llms_txt_checker",
    },
    {
      slug: "sockets",
      title: "Sockets Engine",
      tagline: "High-throughput real-time WebSocket communication & broadcast pipeline.",
      category: "Distributed Systems & Real-Time",
      year: "2026",
      client: "Open Source / GitHub",
      role: "Backend & Systems Engineer",
      timeline: "Ongoing",
      deliverables: ["WebSocket Server Engine", "Real-Time Broadcast Pipeline", "Connection State Machine", "Binary Payload Serialization"],
      metrics: ["Sub-5ms Broadcast Latency", "10,000+ Concurrent Connections", "0% Packet Loss"],
      accentGradient: "from-neutral-800 via-stone-900 to-black",
      image: "/projects/sockets.jpg",
      overview: "A lightweight, resilient WebSocket server and broadcasting architecture built to power low-latency bidirectional messaging, real-time telemetry streaming, and instant peer synchronization.",
      problem: "Traditional polling and HTTP overhead create latency bottlenecks and excessive CPU churn when delivering real-time telemetry and synchronous notifications.",
      process: [
        "Implemented high-performance connection pooling with the native ws WebSocket library in Node.js.",
        "Engineered zero-allocation message broadcast loops iterating through open client connections.",
        "Integrated client lifecycle state tracking (connecting, open, closing, closed) with automated disconnection cleanup.",
      ],
      solution: "A reliable, zero-bloat real-time event pipeline delivering sub-5ms broadcast times and rock-solid state management.",
      keyInsights: [
        "Direct socket broadcasting reduced telemetry transmission overhead by 88% compared to HTTP polling.",
        "Explicit connection state validation prevents socket buffer leaks under network interruption.",
      ],
      deviceType: "phone-light",
      liveUrl: "https://github.com/vpn-cli/sockets",
    },
    {
      slug: "appforge",
      title: "AppForge",
      tagline: "Highly-scalable metadata-driven generative web application runtime & AI copilot.",
      category: "Generative AI & App Engine",
      year: "2026",
      client: "AppForge Platform / GitHub",
      role: "Principal Full-Stack Architect",
      timeline: "2026",
      deliverables: ["Graphical AST Compiler", "AI Copilot Workspace", "Dynamic Postgres Sync Engine", "Semantic Caching Pipeline"],
      metrics: ["<1.2s AST Compilation", "Llama-3.3-70B Pipeline", "300+ Edge Nodes Secured"],
      accentGradient: "from-zinc-800 via-neutral-900 to-black",
      image: "/projects/appforge.jpg",
      overview: "AppForge interprets natural language prompts via large language models, compiles them into a mathematically sound graphical JSON AST, and dynamically renders enterprise-grade B2B applications instantaneously directly inside the Web DOM.",
      problem: "Traditional web applications require developers to hardcode layouts, map databases, and bind REST endpoints manually. Building and iterating prototypes takes days or weeks of repetitive setup.",
      process: [
        "Architected an AI prompt-to-AST compilation pipeline routing requests to Llama-3.3-70B on Groq LPU with <1.2s inference.",
        "Built serverless semantic caching with Upstash Redis to serve repeated prompt topologies with near-zero latency.",
        "Engineered a dynamic Postgres sync engine that executes runtime DDL on Supabase to provision tables on the fly.",
        "Implemented background event streaming into Upstash Kafka for decoupled telemetry and audit trails.",
        "Secured edge routing with Clerk authentication middleware across 300+ edge locations.",
      ],
      solution: "A desktop-grade generative application workspace where anyone can describe an enterprise tool and watch it compile, migrate a database, and deploy live in seconds.",
      keyInsights: [
        "Semantic caching on Upstash Redis cut repetitive generation costs by 68%.",
        "AST-driven dynamic rendering completely eliminated arbitrary code execution risks.",
      ],
      deviceType: "laptop",
      liveUrl: "https://github.com/vpn-cli/appforge",
    },
  ] as Project[],

  // === DEVELOPER RESOURCES & TEMPLATES (Matching Screenshot 210333.png & 210403.png) ===
  resources: [
    {
      id: "crysta",
      title: "Crysta – Portfolio Template",
      category: "Developer Template",
      type: "Next.js 15 & GSAP",
      price: "Free",
      isFree: true,
      description: "Crysta is a modern, glass-inspired template designed for developers and creators who want to showcase their work with clarity, optical depth, and high-performance motion.",
      features: [
        "Dark & Light Modes",
        "Elegant Glass Style & Animations",
        "Page Transitions with GSAP",
        "Fully Responsive Grid System",
        "Built with Tailwind CSS v4 & React 19",
      ],
      previewUrl: "https://crysta-demo.dev",
      downloadUrl: "https://github.com/vipinkaushik",
      gradient: "from-neutral-800 to-black",
    },
    {
      id: "klear",
      title: "Klear – SaaS Boilerplate",
      category: "Full-Stack Starter",
      type: "Next.js & Supabase",
      price: "Free",
      isFree: true,
      description: "Production-ready full-stack SaaS boilerplate with authentication, Stripe billing, PostgreSQL database schema, and automated transactional emails.",
      features: [
        "Supabase Auth & PostgreSQL",
        "Stripe Customer Portal & Subscriptions",
        "Clean Modular Architecture",
        "Server Actions & Optimistic UI",
      ],
      previewUrl: "https://klear-demo.dev",
      downloadUrl: "https://github.com/vipinkaushik",
      gradient: "from-zinc-800 to-black",
    },
    {
      id: "bolder",
      title: "Bolder – 3D Component Kit",
      category: "Graphics Kit",
      type: "Three.js & R3F",
      price: "Free",
      isFree: true,
      description: "Curated collection of refractive glass materials, gyroscopic 3D cards, particle fields, and interactive WebGL canvas components for React.",
      features: [
        "Low-Drawcall GLSL Shaders",
        "Drei Transmission Materials",
        "Cursor Gyroscope Tracking",
        "Mobile Fallback Optimizations",
      ],
      previewUrl: "https://bolder-demo.dev",
      downloadUrl: "https://github.com/vipinkaushik",
      gradient: "from-stone-800 to-black",
    },
    {
      id: "sharm",
      title: "Sharm – Cloud Platform",
      category: "Enterprise Template",
      type: "Next.js & Microservices",
      price: "$49",
      isFree: false,
      description: "Comprehensive multi-tenant cloud dashboard with role-based access control, audit logging, real-time analytics, and billing infrastructure.",
      features: [
        "Multi-Tenant RBAC Security",
        "Real-Time Analytics Charts",
        "Docker & Kubernetes Configs",
        "Comprehensive API Documentation",
      ],
      previewUrl: "https://sharm-demo.dev",
      downloadUrl: "https://github.com/vipinkaushik",
      gradient: "from-neutral-900 to-black",
    },
    {
      id: "benbox",
      title: "BenBox – Tech Blog Template",
      category: "Content System",
      type: "Next.js & MDX",
      price: "Free",
      isFree: true,
      description: "Ultra-fast minimalist developer blog template with MDX, code syntax highlighting, reading time calculation, and RSS feed generation.",
      features: [
        "Full MDX Support with Syntax Highlighting",
        "Zero Layout Shift (CLS: 0)",
        "SEO & OpenGraph Generation",
        "Dark & Light Reader Modes",
      ],
      previewUrl: "https://benbox-demo.dev",
      downloadUrl: "https://github.com/vipinkaushik",
      gradient: "from-zinc-900 to-black",
    },
    {
      id: "project-tracker",
      title: "Project Tracker – Notion System",
      category: "Productivity",
      type: "Notion Architecture",
      price: "Free",
      isFree: true,
      description: "The exact engineering project management database used to ship 15+ production applications from initial spec to deployment.",
      features: [
        "Sprint & Kanban Planning",
        "Architecture RFC Templates",
        "Bug Triaging & Metric Tracking",
        "Client Handoff Portal",
      ],
      previewUrl: "https://notion.so",
      downloadUrl: "https://notion.so",
      gradient: "from-stone-900 to-black",
    },
  ] as ResourceItem[],

  // === EXPERIENCE (Matching Screenshot 210409.png) ===
  experience: [
    {
      period: "Current",
      role: "Lead Full-Stack Developer",
      company: "TechScale Innovations",
      description: "Leading frontend and backend architecture for distributed web applications, high-performance APIs, and interactive design systems.",
    },
    {
      period: "2022 — 2024",
      role: "Senior Full-Stack Engineer",
      company: "CloudCore Labs",
      description: "Engineered scalable cloud services, real-time collaborative workspaces, and optimized rendering engines.",
    },
    {
      period: "2020 — 2022",
      role: "Software Engineer",
      company: "NextGen Media",
      description: "Developed interactive dashboards, responsive client portals, and microservice backends.",
    },
    {
      period: "2019 — 2020",
      role: "Full-Stack Developer Intern",
      company: "InfraSoft",
      description: "Built REST APIs, automated CI/CD deployment pipelines, and accessible UI component systems.",
    },
  ] as Experience[],
};
