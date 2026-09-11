import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Random Port Number Generator – Ephemeral, Registered & Full Range",
  seoDescription:
    "Generate random TCP/UDP port numbers for local development, Docker, testing and services. Pick the ephemeral (49152–65535), registered (1024–49151) or full range. Free, instant.",
  intro:
    "Need a port that won't collide with the dozen dev servers already running on your machine? Generate one — or a batch — from the ephemeral range, the registered range, or the full 0–65535 space. Useful for spinning up Docker containers, mock servers, test databases, game servers and CI jobs where hard-coding 3000 or 8080 guarantees a clash.",
  sections: [
    {
      heading: "The three port ranges",
      bullets: [
        "0–1023 — well-known ports (HTTP 80, HTTPS 443, SSH 22, DNS 53). Assigned by IANA and require root/administrator privileges to bind on most systems. Avoid for your own services.",
        "1024–49151 — registered ports. Many are conventionally associated with software (3306 MySQL, 5432 PostgreSQL, 6379 Redis, 8080 alternative HTTP, 27017 MongoDB) but any process can bind them. Fine for development if you steer clear of the common ones.",
        "49152–65535 — dynamic or ephemeral ports. Operating systems hand these out for outgoing connections and no service is officially registered here, making them the safest choice for temporary listeners.",
      ],
    },
    {
      heading: "Why pick a random port",
      bullets: [
        "Run several copies of the same project (branches, worktrees, PR previews) side by side without editing config each time.",
        "Avoid clashing with tools that silently occupy defaults — 3000 (Node/Rails), 5000 (Flask/macOS AirPlay), 8000 (Django), 8080 (Tomcat, proxies).",
        "Give each integration-test suite its own database and message-broker ports so parallel CI jobs don't interfere.",
        "Map container ports in Docker Compose (-p 51234:80) without hunting for a free host port.",
        "Reduce noise from scanners that probe well-known ports on a public dev box (this is convenience, not security).",
      ],
    },
    {
      heading: "Checking a port is free",
      paragraphs: [
        "A random number is very unlikely to collide, but you can verify before binding: on macOS/Linux run lsof -i :PORT or ss -ltnp | grep PORT; on Windows run netstat -ano | findstr :PORT. Most frameworks also accept port 0 to let the OS choose a free ephemeral port automatically — ideal in test code, though you then need to read the assigned port back.",
      ],
    },
  ],
  howTo: [
    { name: "Choose a range", text: "Select Ephemeral (49152–65535), Registered (1024–49151) or Full Range (0–65535)." },
    { name: "Set how many", text: "Choose the number of ports to generate for multi-service setups." },
    { name: "Generate", text: "Click Generate to produce the ports." },
    { name: "Copy", text: "Copy a single port or the whole list into your config or .env file." },
  ],
  faqs: [
    {
      question: "Which port range is safest for a local dev server?",
      answer:
        "The ephemeral range (49152–65535). No services are registered there, so the only way to collide is with a transient outgoing connection, which is extremely unlikely.",
    },
    {
      question: "Can two programs use the same port?",
      answer:
        "Not for the same protocol on the same address. TCP and UDP are separate namespaces, so TCP 5000 and UDP 5000 can coexist, and different IP addresses can each bind the same port.",
    },
    {
      question: "Why can't I bind port 80 or 443 without sudo?",
      answer: "Ports below 1024 are privileged on Unix-like systems. Run a reverse proxy on 80/443 that forwards to your app on a high port, or use setcap/authbind.",
    },
    {
      question: "Are generated ports guaranteed to be free?",
      answer: "No tool can know what is running on your machine. The ephemeral range minimises the odds; check with lsof or netstat if it matters.",
    },
  ],
  related: ["subnet-calculator", "ipv4-address-converter", "ip-range-expander", "mac-address", "docker-compose-converter", "http-status-codes"],
};

export default content;
