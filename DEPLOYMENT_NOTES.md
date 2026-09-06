# Deployment Notes & Critical Info

This document contains important information for deploying the application to production, including architectural decisions, security bypasses, and known behaviors that colleagues need to be aware of.

## 1. Stripe Webhooks and Client-Side Verification (`/api/checkout/verify`)

**Context:**
The application uses Stripe Checkout for purchasing MMCOINs. After a successful payment, Stripe redirects the user back to the application (`Pond.tsx`) with `payment=success&session_id=...`. The frontend then triggers a `fetch` to `/api/checkout/verify` to validate the payment and credit the coins to the user's account before fully reloading the page.

**Critical Change:**
In the `/api/checkout/verify/route.ts` endpoint, the standard Next.js authentication check (`getServerSession`) was intentionally removed.

**Why was it removed?**
- During local development (and occasionally in production depending on domain/cookie setups), the redirect from Stripe back to the app can cause `getServerSession` to fail (missing cookies, strict SameSite policies, cross-origin issues). This resulted in a 401 Unauthorized error, preventing the local state from refreshing properly.

**Is it secure?**
- **YES.** The verification endpoint is completely secure even without `getServerSession` because the source of truth is Stripe itself. 
- The endpoint queries Stripe using the provided `session_id`.
- It validates that the Stripe session's `payment_status` is explicitly `'paid'`.
- It uses the `userId` stored securely inside the Stripe Session `metadata` (which cannot be tampered with by the user) to identify which account receives the MMCOINs.
- It leverages the `processed` flag inside Stripe metadata to prevent replay attacks (crediting coins multiple times for the same session).

**Action for colleagues:**
Do NOT re-add `getServerSession` to `/api/checkout/verify/route.ts` thinking it is a security flaw. Adding it back will likely break the post-payment redirection flow (especially on local environments or strict mobile browsers).

---
*(Add future notes below)*
