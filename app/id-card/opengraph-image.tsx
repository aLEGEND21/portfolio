import { ImageResponse } from "next/og";

import { profile } from "./profile";

export const alt = `${profile.name} — Contact Card`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Token values are hardcoded here because Satori can't read the route's CSS
// variables — keep in sync with app/id-card/idcard.css.
const ink = "#2a1e14";
const cream = "#f4ddb2";
const amber = "#f0a94e";
const ember = "#e2601c";
const inkFaint = "rgba(42, 30, 20, 0.55)";

export default function Image() {
  const nameLines = profile.name.split(" ");
  const links = Object.entries(profile.links)
    .filter(([, url]) => !url.includes("TODO"))
    .map(([key]) => key.toUpperCase());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 72,
          backgroundColor: ink,
        }}
      >
        {/* Miniature of the portrait card */}
        <div
          style={{
            width: 330,
            height: 520,
            borderRadius: 24,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            backgroundImage: `radial-gradient(circle at 16% 6%, ${cream} 0%, ${amber} 48%, ${ember} 100%)`,
            color: ink,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              letterSpacing: 2,
            }}
          >
            <span>CONTACT CARD</span>
            <span>Nº {profile.issued}</span>
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(42, 30, 20, 0.2)",
              marginTop: 16,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 12,
              border: "1px solid rgba(42, 30, 20, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {nameLines.map((w) => w[0]).join("")}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 32,
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            {nameLines.map((line) => (
              <span key={line}>{line.toUpperCase()}</span>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              letterSpacing: 1.5,
              color: inkFaint,
            }}
          >
            {profile.university.toUpperCase()}
          </div>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 1,
                backgroundColor: "rgba(42, 30, 20, 0.2)",
                marginBottom: 14,
              }}
            />
            <div style={{ display: "flex", gap: 12, fontSize: 12, letterSpacing: 1.5 }}>
              {links.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right-hand copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 520,
            color: cream,
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 4, color: amber }}>
            ID.ARNAVM.COM
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 24,
              lineHeight: 1.5,
              color: "rgba(244, 221, 178, 0.75)",
            }}
          >
            {profile.bio}
          </div>
        </div>
      </div>
    ),
    size
  );
}
