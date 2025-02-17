import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/wizard(.*)",
  "/transactions(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes first
  if (isProtectedRoute(req)) {
    try {
      await auth.protect();
    } catch {
      // If auth.protect() fails, redirect to home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const { userId } = await auth();

  // Handle non-authenticated users
  if (!userId) {
    // Only redirect if trying to access protected routes
    if (isProtectedRoute(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // For authenticated users, check their setup status
  try {
    const user = await convexClient.query(api.users.getUserById, {
      clerkId: userId,
    });

    // New user without currency setup
    if (!user || user.currency === "") {
      if (!req.url.includes("/wizard") && !req.url.includes("/sign-out")) {
        return NextResponse.redirect(new URL("/wizard", req.url));
      }
    } else {
      // User with complete setup
      if (
        !req.url.includes("/dashboard") &&
        !req.url.includes("/sign-out") &&
        !req.url.includes("/transactions") &&
        !req.url.includes("/settings")
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    // In case of error, redirect to home
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
