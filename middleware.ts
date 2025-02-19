import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/wizard(.*)",
  "/transactions(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = new URL(req.url).pathname;

  if (userId && pathname === "/") {
    try {
      const user = await convexClient.query(api.users.getUserById, {
        clerkId: userId,
      });

      if (!user || user?.currency === "") {
        return Response.redirect(new URL("/wizard", req.url));
      } else {
        return Response.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      return Response.redirect(new URL("/wizard", req.url));
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|api/auth|images|logo\\.png|favicon\\.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
