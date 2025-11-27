import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This Middleware does not protect any routes by default.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware

const isProtectedRoute = createRouteMatcher(["/protected(.*)", "/forum(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // All except the webhook endpoint
    "/((?!api/webhook|_next|[^?]*\\.(?:html?|css|js(?!on)|...)).*)",
    "/(api|trpc)(.*)",
  ],
};
