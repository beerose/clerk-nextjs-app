import { clerkMiddleware } from '@clerk/nextjs/server'

// This Middleware does not protect any routes by default.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware
export default clerkMiddleware()

export const config = {
  matcher: [
    // All except the webhook endpoint
    '/((?!api/webhook|_next|[^?]*\\.(?:html?|css|js(?!on)|...)).*)',
    '/(api|trpc)(.*)',
  ],
}
