import { ImageResponse } from "next/og";

import { linkOrder } from "./components/SocialLinks";
import { formatIssued, profile } from "./profile";

export const alt = `${profile.name} — Contact Card`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Re-render hourly so the card's issue date tracks the current day. Pinned to
// Eastern since the server clock is UTC and would roll over to "tomorrow" early.
export const revalidate = 3600;
const issuedTimeZone = "America/New_York";

// Token values are hardcoded here because Satori can't read the route's CSS
// variables — keep in sync with app/id-card/idcard.css.
const ink = "#141e2a";
const frost = "#b2ddf4";
const sky = "#4ea9f0";
const cobalt = "#1c60e2";
const inkFaint = "rgba(20, 30, 42, 0.55)";

export default function Image() {
  const nameLines = profile.name.split(" ");
  const links = linkOrder.filter(
    ({ key }) => !profile.links[key].includes("TODO")
  );

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
            alignItems: "center",
            backgroundImage: `radial-gradient(circle at 16% 6%, ${frost} 0%, ${sky} 48%, ${cobalt} 100%)`,
            color: ink,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              letterSpacing: 2,
            }}
          >
            <span>CONTACT CARD</span>
            <span>Nº {formatIssued(new Date(), issuedTimeZone)}</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(20, 30, 42, 0.2)",
              marginTop: 16,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              marginTop: "auto",
              width: 88,
              height: 88,
              borderRadius: 12,
              border: "1px solid rgba(20, 30, 42, 0.2)",
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
              alignItems: "center",
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 14,
              // Fixed space here biases the auto-margin split so the content
              // block sits slightly above true center.
              marginBottom: 28,
              fontSize: 14,
              letterSpacing: 1.5,
              color: inkFaint,
            }}
          >
            {profile.university.split(" · ").map((line) => (
              <span key={line}>{line.toUpperCase()}</span>
            ))}
          </div>
          <div
            style={{
              width: "100%",
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 1,
                backgroundColor: "rgba(20, 30, 42, 0.2)",
                marginBottom: 14,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {links.map(({ key, Icon }) => (
                <Icon key={key} width={24} height={24} />
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
            color: frost,
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 4, color: sky }}>
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
              color: "rgba(178, 221, 244, 0.75)",
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
