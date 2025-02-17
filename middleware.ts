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

// Define public routes that should always be accessible
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Always allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      // Redirect to sign-in if not authenticated
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
      await auth.protect();
    } catch {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // If user is not authenticated, don't proceed further
  if (!userId) {
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
