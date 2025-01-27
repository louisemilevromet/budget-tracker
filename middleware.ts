import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  
  // If user is connected and on the home page
  if (userId && new URL(req.url).pathname === '/') {
    const user = await convexClient.query('users:getUserCurrency', { clerkId: userId })
    
    if (user?.currency === "") {
      return Response.redirect(new URL('/wizard', req.url))
    } else {
      return Response.redirect(new URL('/dashboard', req.url))
    }
  }

  // Only protect protected routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}