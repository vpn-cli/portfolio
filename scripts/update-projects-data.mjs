import fs from "fs";

const streamMartProject = `  {
    slug: "stream-mart",
    title: "StreamMart",
    tagline:
      "Event-driven microservices e-commerce backend built on an asynchronous Apache Kafka message bus with Transactional Outbox pattern.",
    category: "Distributed Systems & Microservices",
    year: "2026",
    client: "Open Source",
    role: "Backend Infrastructure & Systems Architect",
    timeline: "Aug 2026 — Sep 2026",
    accentGradient: "from-zinc-900 via-neutral-900 to-black",
    image: "/projects/stream-mart.png",
    deviceType: "laptop",
    links: {
      demo: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
      repo: "https://github.com/vpn-cli/StreamMart",
      readme: "https://github.com/vpn-cli/StreamMart#readme",
    },
    tldr: {
      title: "StreamMart",
      pitch:
        "Architected a decoupled event-driven microservices backend powered by Apache Kafka, ensuring guaranteed at-least-once message delivery via the Transactional Outbox Pattern.",
      summary: {
        problem:
          "Direct synchronous HTTP communication between microservices creates tight coupling, cascading failures, and distributed state inconsistencies during network timeouts.",
        built:
          "An asynchronous microservices cluster (API Gateway, Orders, Payments, Analytics, Email) orchestrated with Apache Kafka, Drizzle ORM, Neon PostgreSQL, and Docker Compose.",
        outcome:
          "Achieved zero message loss across services, eliminated cascading HTTP bottlenecks, and enforced atomic state persistence with transactional outbox workers.",
      },
      role: "Backend Systems Architect",
      timeline: "Aug 2026 — Sep 2026",
      stack: [
        "Node.js",
        "Express",
        "Apache Kafka",
        "Neon PostgreSQL",
        "Drizzle ORM",
        "Docker",
        "Kubernetes",
        "JWT",
      ],
      readingTime: "5 min read",
    },
    context: {
      takeaway: "Distributed e-commerce architectures must never rely on brittle synchronous HTTP chains for core order lifecycles.",
      description:
        "When a customer submits a payment, coupling order fulfillment, stock deduction, analytics logging, and transactional email into one continuous synchronous chain causes cascading failures whenever any downstream service experiences latency or downtime.",
    },
    problem: {
      takeaway: "Atomic local database persistence does not guarantee reliable distributed event delivery.",
      description:
        "If payment-service writes to PostgreSQL and subsequently crashes before calling Kafka, the payment is recorded but the order is never created. Dual-write scenarios without transactional outboxing corrupt distributed system integrity.",
      comparison: {
        before: {
          title: "Brittle Synchronous HTTP Chains",
          points: [
            "Cascading service timeouts when downstream microservices lag",
            "Data inconsistency if message broker publish fails after DB insert",
            "Direct service exposure increases security attack surface area",
            "Unbounded latency spikes during peak transaction volume",
          ],
        },
        after: {
          title: "Decoupled Event-Driven Pipeline",
          points: [
            "Atomic local transactions write payment and outbox event together",
            "Background outbox worker guarantees at-least-once Kafka publish",
            "API Gateway handles rate limiting, JWT auth, and reverse proxying",
            "Independent consumer scalability with zero synchronous backpressure",
          ],
        },
      },
      coreChallenge:
        "How to guarantee distributed data consistency between relational PostgreSQL tables and Apache Kafka topics under intermittent network partitions without distributed locks.",
    },
    goals: {
      takeaway: "Zero data loss, isolated failure domains, and horizontal consumer scaling.",
      items: [
        {
          label: "Transactional Outbox Pattern",
          detail: "Guarantee at-least-once message delivery by committing outbox records in the same transaction as state changes.",
        },
        {
          label: "Unified API Gateway",
          detail: "Centralize JWT verification and reverse-proxy internal cluster ports behind a secure perimeter.",
        },
        {
          label: "Decoupled Microservices",
          detail: "Allow Order, Payment, Analytics, and Notification workers to scale and fail independently without blocking clients.",
        },
      ],
    },
    journey: [
      {
        chapter: "Chapter 1",
        timeline: "Aug 2026",
        title: "Microservices Decomposition & Message Broker Topology",
        narrative:
          "Split monolithic checkout into specialized services: API Gateway, Payment, Order, Analytics, and Email. Deployed Apache Kafka and Zookeeper as the central event distribution backbone.",
      },
      {
        chapter: "Chapter 2",
        timeline: "Aug 2026",
        title: "Transactional Outbox Implementation with Drizzle ORM",
        narrative:
          "Solved dual-write race conditions by executing payment insertion and outbox_events queue insertion in a single atomic database transaction, polled by dedicated worker processes.",
      },
    ],
    flowSteps: [
      {
        step: 1,
        title: "Client Checkout Request",
        actor: "API Gateway",
        description: "Validates JWT header, applies rate limits, and proxies request to payment-service.",
      },
      {
        step: 2,
        title: "Atomic Outbox Transaction",
        actor: "Payment Service",
        description: "Inserts payment record and outbox event into Neon PostgreSQL in one SQL transaction.",
      },
      {
        step: 3,
        title: "Kafka Event Broadcast",
        actor: "Outbox Worker",
        description: "Polls pending events and publishes to topic 'payment-successful' on Apache Kafka.",
      },
      {
        step: 4,
        title: "Asynchronous Fulfillment & Notification",
        actor: "Order & Email Services",
        description: "Order service updates inventory and fulfillment status; email service dispatches customer receipt.",
      },
    ],
    challenges: [
      {
        title: "Dual-Write Consistency Under Network Drops",
        symptom: "Payments recorded in database without corresponding order creation during broker restarts.",
        rootCause: "Separate database commit and HTTP/Kafka publish statements without transactional atomicity.",
        solution: "Implemented the Transactional Outbox Pattern using atomic Drizzle ORM SQL transactions.",
      },
    ],
    results: {
      takeaway: "Zero message loss and decoupled event throughput across isolated service boundaries.",
      metrics: [
        {
          value: "100%",
          label: "Message Delivery Guarantee",
          source: "Transactional Outbox Pattern implementation",
        },
        {
          value: "0",
          label: "Cascading HTTP Timeouts",
          source: "Kafka asynchronous topic decoupling",
        },
        {
          value: "5",
          label: "Decoupled Microservices",
          source: "Gateway, Order, Payment, Analytics, Notification",
        },
        {
          value: "100%",
          label: "Type Safety",
          source: "Drizzle ORM & TypeScript schemas",
        },
      ],
      qualitative: [
        "Guaranteed At-Least-Once Delivery: Atomic outbox commit eliminates dual-write race conditions.",
        "Secure Reverse Proxy: API Gateway enforces JWT authentication before traffic touches internal services.",
        "Vendor-Agnostic Persistence: Neon PostgreSQL + Drizzle ORM ensures instant portability to AWS RDS or GCP.",
      ],
    },
    learnings: {
      takeaway: "Distributed consistency is an architectural pattern, not a database feature.",
      items: [
        {
          title: "Dual Writes Always Fail Eventually",
          detail:
            "Writing to a DB and then immediately writing to a message broker in an application thread is an anti-pattern. The Transactional Outbox pattern is essential for reliable event-driven systems.",
        },
        {
          title: "Asynchronous Pipelines Protect User Experience",
          detail:
            "Returning an immediate 202 Accepted or 200 OK while processing downstream tasks asynchronously keeps user response times under 50ms.",
        },
      ],
    },
    tryIt: {
      takeaway: "Spin up the complete microservices cluster locally using Docker Compose.",
      steps: [
        "Clone the repository from github.com/vpn-cli/StreamMart.",
        "Configure your Neon PostgreSQL DATABASE_URL in .env.",
        "Run 'docker-compose up --build -d' to start Zookeeper, Kafka, API Gateway, and microservices.",
        "Send test transactions to port 8080 and watch events flow across Kafka topics in real time.",
      ],
    },
    deliverables: [
      "Kafka Event Bus",
      "Transactional Outbox Worker",
      "API Gateway & Reverse Proxy",
      "Docker Compose Orchestration",
    ],
    metrics: ["100% Guaranteed Delivery", "5 Decoupled Services", "Sub-50ms Gateway Response"],
    overview:
      "StreamMart is an enterprise-grade, event-driven e-commerce microservices architecture demonstrating fault-tolerant distributed system patterns with Apache Kafka and PostgreSQL.",
    solution:
      "A fully decoupled microservices architecture utilizing the Transactional Outbox pattern to ensure guaranteed at-least-once event delivery across isolated services.",
    keyInsights: [
      "Decoupling via Kafka eliminates cascading failures during peak load.",
      "Transactional outboxing guarantees consistency without complex distributed transactions.",
    ],
    githubUrl: "https://github.com/vpn-cli/StreamMart",
    liveUrl: "https://github.com/vpn-cli/StreamMart#architecture--workflow",
  }`;

const filepath = "data/projects.ts";
let content = fs.readFileSync(filepath, "utf8");

// Find start of llms-txt
const startMarker = '  {\r\n    slug: "llms-txt",';
const startMarkerLF = '  {\n    slug: "llms-txt",';

let startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  startIdx = content.indexOf(startMarkerLF);
}

if (startIdx === -1) {
  console.error("Could not find start marker for llms-txt");
  process.exit(1);
}

// Find end of projectsRaw array
const endMarker = "\r\n];\r\n\r\n// Validate all projects";
const endMarkerLF = "\n];\n\n// Validate all projects";

let endIdx = content.indexOf(endMarker);
if (endIdx === -1) {
  endIdx = content.indexOf(endMarkerLF);
}

if (endIdx === -1) {
  console.error("Could not find end marker");
  process.exit(1);
}

const newContent = content.slice(0, startIdx) + streamMartProject + content.slice(endIdx);
fs.writeFileSync(filepath, newContent, "utf8");
console.log("Successfully replaced llms-txt with stream-mart in data/projects.ts");

