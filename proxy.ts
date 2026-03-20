import { NextRequest, NextResponse } from "next/server";

// Routes that require a logged-in user
const protectedRoutes = ["/", "/interview"];

// Routes that logged-in users should not see
const authRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Not logged in → trying to access protected route → redirect to sign-in
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Already logged in → trying to access sign-in or sign-up → redirect to home
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
