import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "1234"
);

// Öffentliche Pfade, die KEINEN Login erfordern
const publicPaths = ["/", "/login", "/register", "/recipes"];

function isPublicPath(pathname: string): boolean {
  // Exakte Matches oder Pfade die mit /recipes/ beginnen (Detailseiten)
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith("/recipes/") && !pathname.includes("/edit") && !pathname.includes("/add")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Öffentliche Pfade durchlassen
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Token aus Cookie lesen
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Kein Token → Redirect auf Login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Token verifizieren
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token ungültig/abgelaufen → Cookie löschen und Redirect
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  }
}

// Matcher: Auf welche Pfade wird die Middleware angewendet?
export const config = {
  matcher: [
    // Alles außer statische Files, API-Routes und _next
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};