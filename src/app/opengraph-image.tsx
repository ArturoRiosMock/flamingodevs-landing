import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Flamingo Devs - Desarrollo Web y Automatización con IA";
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
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo Circle with Flamingo */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "#000",
            border: "4px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
            fontSize: 100,
          }}
        >
          🦩
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Flamingo Devs
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#888888",
            marginBottom: 40,
          }}
        >
          Desarrollo Web y Automatización con IA
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#FF6B6B22",
              color: "#FF6B6B",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Shopify Partner
          </div>
          <div
            style={{
              background: "#ffffff11",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Next.js
          </div>
          <div
            style={{
              background: "#ffffff11",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            WordPress
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#666666",
          }}
        >
          flamingodevs.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
