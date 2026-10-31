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
  avatar: "/images/avatar.svg",
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
    { label: "GitHub", handle: "vipinkaushik", url: "https://github.com", icon: "github" },
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
      slug: "cashless",
      title: "Cashless",
      tagline: "Mobile financial management & real-time budgeting application.",
      category: "Fintech & Mobile App",
      year: "2025 — 2026",
      client: "Cashless Labs",
      role: "Lead Full-Stack & Mobile Engineer",
      timeline: "5 Months",
      deliverables: ["Full-Stack Architecture", "React Native Mobile App", "Real-Time Ledger Engine", "Biometric Auth"],
      metrics: ["Sub-50ms API Latency", "99.99% Uptime on Cloud", "Over $12M Processed"],
      accentGradient: "from-zinc-900 via-neutral-900 to-black",
      image: "/images/project-1.svg",
      overview: "Managing finances with tools for tracking expenses and budgeting. An application designed to help users effortlessly master their personal cash flow, subscriptions, and investment portfolios in real-time.",
      problem: "As individuals manage numerous accounts, credit cards, and recurring bills, financial visibility fragments. The obstacle was to build a mobile application that is ultra-fast, user-friendly, and packed with banking-grade encryption while keeping the UI effortless.",
      process: [
        "Conducted quantitative user research into expense categorization friction and latency bottlenecks.",
        "Created high-fidelity wireframes, animated prototypes, and micro-interactions optimized for rapid one-handed logging.",
        "Built resilient offline-first state synchronization, WebSocket ledger updates, and automated budget goal intelligence.",
      ],
      solution: "A sleek, dark-mode financial cockpit where cards, accounts, and predictive spending analytics update in real-time with zero friction.",
      keyInsights: [
        "Instant transaction categorization increased monthly user retention by 42%.",
        "Optimized SQLite on-device cache eliminated network load times entirely for recurring checks.",
        "Biometric encryption reduced checkout authentication friction from 14 seconds to under 2 seconds.",
      ],
      deviceType: "phone-dark",
      liveUrl: "https://cashless-demo.dev",
    },
    {
      slug: "mono",
      title: "Mono Pay",
      tagline: "Next-gen peer-to-peer crypto and fiat payment terminal.",
      category: "Fintech & Web3",
      year: "2025",
      client: "Mono Financial",
      role: "Senior Frontend Engineer",
      timeline: "4 Months",
      deliverables: ["Web Application", "Smart Contract Bridge", "Interactive Dashboard", "Design System"],
      metrics: ["$4.5M Volume in Beta", "250K+ Transactions", "Framer Site of the Day"],
      accentGradient: "from-neutral-800 via-stone-900 to-black",
      image: "/images/project-2.svg",
      overview: "Mono Pay reimagines global money transfers. Built with high tactile precision, instant currency conversion, and cryptographic verification, it bridges fiat bank transfers with decentralized settlement.",
      problem: "Cross-border transfers are historically slow, expensive, and opaque. Traditional banking portals require multi-step forms that lead to 30%+ drop-off.",
      process: [
        "Streamlined the transfer flow into a single-glance currency slider with real-time fee calculation.",
        "Engineered zero-latency feedback with GSAP spring animations on transaction settlement.",
        "Integrated multi-currency wallets with instant bank clearing APIs.",
      ],
      solution: "A clean, modern payment surface that lets users send funds globally with 3 taps, complete with verified receipts and automated tax categorization.",
      keyInsights: [
        "Single-page transfer flows decreased transaction abandonment by 58%.",
        "Haptic spring confirmation increased user trust in instant settlements.",
      ],
      deviceType: "phone-light",
      liveUrl: "https://monopay-demo.dev",
    },
    {
      slug: "nexus",
      title: "Nexus DevFlow",
      tagline: "High-performance cloud workspace and telemetry dashboard for engineering teams.",
      category: "Developer Tooling & Cloud SaaS",
      year: "2026",
      client: "Nexus Cloud Corp",
      role: "Principal Architect",
      timeline: "6 Months",
      deliverables: ["Web Application", "Distributed Telemetry Engine", "Design System", "CLI Tooling"],
      metrics: ["10x Faster Deploy Times", "Used by 1,200+ Engineering Teams", "Product Hunt #1"],
      accentGradient: "from-zinc-800 via-neutral-900 to-black",
      image: "/images/project-3.svg",
      overview: "Nexus DevFlow provides engineering teams with a unified command center. From real-time cluster monitoring and automated CI/CD deployments to distributed tracing, Nexus brings simplicity to cloud infrastructure.",
      problem: "Modern cloud microservices overwhelm developers with scattered consoles, fragmented logs, and context switching across disparate providers.",
      process: [
        "Architected a unified GraphQL backend aggregating cluster metrics across AWS, GCP, and Kubernetes.",
        "Developed custom canvas-rendered real-time log viewers supporting 100,000+ lines per second without UI stutter.",
        "Implemented seamless keyboard shortcuts (CMD+K) for instant navigation across all services.",
      ],
      solution: "A desktop-grade web application featuring modular bento widgets, instant infrastructure rollbacks, and synchronized cluster diagnostics.",
      keyInsights: [
        "Centralized telemetry decreased Mean Time To Resolution (MTTR) by 64%.",
        "WebGL-accelerated trace graphs rendered 50,000 node traces smoothly at 60fps.",
      ],
      deviceType: "laptop",
      liveUrl: "https://nexus-devflow.dev",
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
