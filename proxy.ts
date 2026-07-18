import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serve the contact card on id.arnavm.com: any request arriving with an
// `id.` host is rewritten into the /id-card route group. Requests already
// under /id-card (e.g. the opengraph-image route the metadata URLs point
// at) pass through untouched so they don't get double-prefixed.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;
  if (host.startsWith("id.") && !pathname.startsWith("/id-card")) {
    return NextResponse.rewrite(new URL(`/id-card${pathname}`, request.url));
  }
}

export const config = {
  // Skip Next internals and any file-extension request (public/ assets),
  // which must resolve at their real paths on every hostname.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
