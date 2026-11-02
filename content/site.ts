import { projects, CaseStudy } from "@/data/projects";

export type Project = CaseStudy;
export type { CaseStudy };

export interface ProjectDecision {
  title: string;
  description: string;
}

export interface ProjectArchitectureStep {
  id: string;
  label: string;
  role: string;
  tech: string;
}

export interface ProjectMetricResult {
  value: string;
  label: string;
  source: string;
}

export interface ProjectCodeSnippet {
  filename: string;
  language: string;
  code: string;
  explanation?: string;
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
  role: "Full-Stack Developer & Backend Systems Engineer",
  city: "New Delhi",
  country: "India",
  avatar: "/avatar.jpg",
  timezone: "Asia/Kolkata",
  email: "vipinkaushik20771041@gmail.com",
  // TODO: Customize exact job-seeker availability wording
  status: "Open to SDE roles · Immediate availability",
  bio: "I build full-stack web applications and the backend systems behind them, mostly with Next.js, Node.js, and PostgreSQL.",
  story: "I focus on distributed systems, real-time data streaming, and scalable web architectures built with modern web standards.",
  whatIDoNow: "Today I build full-stack applications with Next.js, TypeScript, and Node.js, backed by PostgreSQL and event-driven Kafka message queues.",
  whatIDoBest: {
    title: "Full-Stack & Backend Systems",
    description: "Building distributed systems, real-time WebSocket pipelines, and reliable microservices architectures.",
  },

  // === SOCIAL PLATFORMS (GitHub & LinkedIn) ===
  socials: [
    { label: "GitHub", handle: "vpn-cli", url: "https://github.com/vpn-cli", icon: "github" },
    { label: "LinkedIn", handle: "vpnk2003", url: "https://www.linkedin.com/in/vpnk2003", icon: "linkedin" },
  ],

  // === TECH STACK (Exact app icons matching reference) ===
  techStack: [
    // Core languages & frameworks
    { name: "TypeScript", icon: "typescript", category: "Language", color: "#3178C6" },
    { name: "JavaScript", icon: "javascript", category: "Language", color: "#F7DF1E" },
    { name: "React", icon: "react", category: "Frontend", color: "#61DAFB" },
    { name: "Next.js", icon: "nextjs", category: "Framework", color: "#000000" },
    { name: "Node.js", icon: "nodejs", category: "Runtime", color: "#5FA04E" },
    // Backend & data
    { name: "Express", icon: "express", category: "Backend", color: "#0A0A0A" },
    { name: "PostgreSQL", icon: "postgres", category: "Database", color: "#4169E1" },
    { name: "Drizzle", icon: "drizzle", category: "ORM", color: "#C5F74F" },
    { name: "Kafka", icon: "kafka", category: "Streaming", color: "#231F20" },
    { name: "Redis", icon: "redis", category: "Database", color: "#FF4438" },
    // Infra & tools
    { name: "Docker", icon: "docker", category: "DevOps", color: "#2496ED" },
    { name: "Vercel", icon: "vercel", category: "Cloud", color: "#000000" },
    { name: "Supabase", icon: "supabase", category: "Database", color: "#3FCF8E" },
    { name: "Tailwind CSS", icon: "tailwind", category: "Styling", color: "#06B6D4" },
    { name: "Figma", icon: "figma", category: "Design", color: "#F24E1E" },
    { name: "Git", icon: "git", category: "Tooling", color: "#F03C2E" },
  ],

  // === PROJECTS & CASE STUDIES ===
  projects: projects as Project[],

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
        "Clean Minimalist Style & Animations",
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
