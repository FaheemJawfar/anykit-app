import { ImageResponse } from "next/og";

export const alt = "AnyKit App - 100+ Free Online Developer & Utility Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            display: "flex",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "white",
              fontWeight: 900,
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            AnyKit App
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          100+ Free Online Developer & Utility Tools
        </div>

        {/* Tool pills */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "800px",
          }}
        >
          {[
            "JSON Formatter",
            "PDF Tools",
            "Base64",
            "Regex Tester",
            "Color Converter",
            "UUID Generator",
            "JWT Parser",
            "Hash Tools",
          ].map((tool) => (
            <div
              key={tool}
              style={{
                padding: "8px 20px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "999px",
                color: "rgba(255,255,255,0.65)",
                fontSize: "16px",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
              }}
            >
              {tool}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.35)",
            display: "flex",
          }}
        >
          anykit.app — No sign-up required
        </div>
      </div>
    ),
    { ...size }
  );
}
