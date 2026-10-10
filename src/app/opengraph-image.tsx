import { ImageResponse } from "next/og";

export const alt = "Mohd Zaid, AI Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card for LinkedIn, X, Slack etc. Rendered once at build time.
export default function OpengraphImage() {
  const chips = ["Node.js · Fastify", "PostgreSQL RLS", "RAG & LLMs", "Docker · Azure · CI/CD", "Next.js"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 80% 0%, #4c1d95 0%, #030014 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#c4b5fd", letterSpacing: 4 }}>ZAIDFOLIO.SPACE</div>
        <div style={{ fontSize: 88, fontWeight: 800, marginTop: 20 }}>Mohd Zaid</div>
        <div style={{ fontSize: 44, marginTop: 8, color: "#e9d5ff" }}>AI Full-Stack Engineer · Backend · DevOps</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 48 }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                fontSize: 26,
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid #7c3aed",
                background: "rgba(124,58,237,0.18)",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
