import { ImageResponse } from "next/og";

import { SITE_NAME } from "@shared/lib/site";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? `${SITE_NAME} — Boutique de moda`).slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") ?? "BOUTIQUE DE MODA").slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #fce4ea 0%, #ffffff 45%, #d6f0e4 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            color: "#c97b84",
            fontWeight: 500,
          }}
        >
          {eyebrow.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.1,
              color: "#1f1f1f",
              fontWeight: 500,
              display: "flex",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 120,
              height: 6,
              borderRadius: 999,
              background: "#7ec8a8",
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#5a5a5a",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 44, color: "#c97b84", fontWeight: 500 }}>Rosa</span>
            <span style={{ color: "#7ec8a8" }}>·</span>
            <span style={{ fontSize: 44, color: "#7ec8a8", fontWeight: 500 }}>Menta</span>
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 4 }}>
            MADE IN MX 🇲🇽
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
