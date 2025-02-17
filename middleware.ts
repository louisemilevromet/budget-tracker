import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Define protected routes
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/wizard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId) {
    if (!req.url.includes("/")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const user = await convexClient.query(api.users.getUserById, {
    clerkId: userId,
  });

  if (!user || user.currency === "") {
    if (!req.url.includes("/wizard") && !req.url.includes("/sign-out")) {
      console.log("Redirecting to /wizard");
      return NextResponse.redirect(new URL("/wizard", req.url));
    }
  } else {
    if (
      !req.url.includes("/dashboard") &&
      !req.url.includes("/sign-out") &&
      !req.url.includes("/transactions") &&
      !req.url.includes("/settings")
    ) {
      console.log("Redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Only protect protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
