import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const routeName = request.nextUrl.pathname;
  const { pathname } = request.nextUrl;

  // Allow static files and Next.js internals through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/) // allow all images
  ) {
    return NextResponse.next();
  }

  const publicRoutes = [
    "/",
    "/login",
    "/forgotpassword",
    "/signup",
    "/verifypassword",
    "/resetpassword",
  ];

  const isPublicRoute = publicRoutes.includes(routeName);

  console.log("routeName", routeName);
  console.log("isPublicRoute", isPublicRoute);
  console.log("token", token);
  console.log("Cond 1:", !isPublicRoute && !token);
  console.log("Cond 2:", isPublicRoute && token);

  if (isPublicRoute && !token) {
    return NextResponse.next();
  }

  if (!isPublicRoute && !token) {
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isPublicRoute && token) {
    if (request.nextUrl.pathname === "/dashboard") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|firebase-messaging-sw.js).*)",
  ],
};
