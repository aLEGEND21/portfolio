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
export function formatIssued(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getFullYear() % 100)
  );
}
