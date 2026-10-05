// Single source of truth for the contact card's copy. The page components
// and opengraph-image.tsx both read from here — edit this file to change
// what the card says, no component changes needed.
export const profile = {
  name: "Arnav Murthi",
  university: "UNC Chapel Hill · Computer Science",
  location: "Chapel Hill, NC",
  classYear: "2028",
  // Linked from the portfolio footer.
  email: "armurthi@unc.edu",
  bio: "Full-stack developer, founder, and freelancer. Creator of ProfitGreen, an investing app with 7,000+ users.",
  links: {
    github: "https://github.com/aLEGEND21",
    linkedin: "https://www.linkedin.com/in/arnav-murthi",
    instagram: "https://instagram.com/_arnav.m_",
    portfolio: "https://arnavm.com",
  },
  // Set to null to fall back to the "AM" monogram treatment.
  photo: "/headshot.jpg" as string | null,
};

// Card "serial" in the top-right corner — the issue date (always "today") in
// mmddyy, deliberately unpunctuated so it reads as an ID number at first glance.
// `timeZone` defaults to the runtime's local zone (the viewer's, on the client).
export function formatIssued(date: Date, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    timeZone,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return get("month") + get("day") + get("year");
}
