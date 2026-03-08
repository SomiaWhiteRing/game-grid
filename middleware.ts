import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LEGACY_LOCALES = new Set(
  [
    "zh-cn",
    "zh-tw",
    "en",
    "ja",
    "ko",
    "fr",
    "de",
    "es",
    "pt",
    "it",
    "ru",
    "nl",
    "pl",
    "tr",
  ].map((item) => item.toLowerCase())
);

function getFirstSegment(pathname: string): string | null {
  const segment = pathname.split("/")[1]?.trim();
  return segment ? segment.toLowerCase() : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = getFirstSegment(pathname);

  if (!firstSegment || !LEGACY_LOCALES.has(firstSegment)) {
    return NextResponse.next();
  }

  const target = new URL("/", request.url);
  if (request.nextUrl.search) {
    target.search = request.nextUrl.search;
  }
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: ["/((?!_next/|api/|assets/|.*\\..*).*)"],
};
