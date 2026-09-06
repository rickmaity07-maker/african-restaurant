# Deployment & API Setup Guide — Karmel Café & Restaurant

Do these in order. Every value you collect goes into `.env` locally and into
**Vercel → Project → Settings → Environment Variables** before deploying.

## 1. Database — Neon Postgres (free tier works)
1. Go to https://neon.tech → sign up → "Create a project".
2. Copy the connection string shown (starts with `postgresql://`).
3. Paste it into `DATABASE_URL` in `.env`.
4. Run locally: `npm install` → `npx prisma db push` (creates all tables).

## 2. Auth.js secret
1. Run: `npx auth secret` (or `openssl rand -base64 32`).
2. Put the output in `AUTH_SECRET`.
3. Set `NEXTAUTH_URL` to `http://localhost:3000` locally, and to your real
   domain (e.g. `https://karmel-restaurant.vercel.app`) in Vercel.

## 3. Google Login
1. Go to https://console.cloud.google.com → create a project.
2. "APIs & Services" → "OAuth consent screen" → set up (External, add app name/logo/support email).
3. "Credentials" → "Create Credentials" → "OAuth client ID" → type: Web application.
4. Authorized redirect URI:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://YOUR-DOMAIN/api/auth/callback/google`
5. Copy Client ID / Client Secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## 4. Facebook Login
1. Go to https://developers.facebook.com/apps → "Create App" → type: Consumer.
2. Add product "Facebook Login" → Settings → Valid OAuth Redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/facebook`
   - Prod: `https://YOUR-DOMAIN/api/auth/callback/facebook`
3. Settings → Basic → copy App ID / App Secret into `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET`.
4. Switch the app from "Development" to "Live" mode once ready for real users.

## 5. Resend — email (verification codes, password reset, reservation confirmations)
1. Go to https://resend.com → sign up (free tier: 3,000 emails/month).
2. "API Keys" → create one → paste into `RESEND_API_KEY`.
3. "Domains" → add your real domain and verify it (DNS records) so `EMAIL_FROM`
   can use your domain (e.g. `Karmel <reservations@karmel-restaurant.com>`).
   Until then, use the default `onboarding@resend.dev` sender for testing.
4. Set `ADMIN_EMAIL` to the restaurant owner's inbox — this is where every new
   reservation notification (name, email, phone, day, date, time, guests) is sent.

## 6. Twilio Verify — phone number OTP
1. Go to https://www.twilio.com/try-twilio → sign up (free trial credit included).
2. Console dashboard → copy **Account SID** and **Auth Token** → `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`.
3. Left menu → "Verify" → "Services" → "Create new Service" (name it "Karmel").
4. Copy the **Service SID** → `TWILIO_VERIFY_SERVICE_SID`.
   Twilio Verify handles the SMS OTP send/check/expiry/retry logic for you —
   no extra code needed.
5. On a trial account you can only send SMS to verified numbers — verify your
   own test number in the Twilio console, or upgrade the account before going live.

## 7. Upstash Redis — rate limiting (recommended, stops registration/OTP abuse)
1. Go to https://upstash.com → sign up → "Create Database" (Redis, Global/Regional, free tier).
2. Copy "REST URL" and "REST TOKEN" → `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
   If you skip this, the app still works — rate limiting is just disabled.

## 8. First admin account
There's no public "become admin" button (by design). After you register your
own account normally on the live site:
```
npx dotenv -e .env -- npm run make-admin -- you@yourdomain.com
```
(or run `node scripts/make-admin.mjs you@yourdomain.com` with `DATABASE_URL` set in your shell).
This flips your `role` to `ADMIN`, unlocking `/admin`.

## 9. Deploy to Vercel
1. Push this repo to GitHub.
2. https://vercel.com → "Add New Project" → import the repo.
3. In "Environment Variables", paste every key from `.env.example` with your real values
   (use your production `NEXTAUTH_URL`, e.g. `https://your-project.vercel.app`).
4. Deploy. Vercel runs `prisma generate` automatically via the `postinstall` script.
5. After the first deploy, run `npx prisma db push` once (locally, pointed at the
   same `DATABASE_URL`) to make sure the production database has all tables.
6. Re-check the Google/Facebook redirect URIs match your final production domain.

## Notes on the anti-abuse ("fake email") system
- Registration rejects any email whose domain is in the maintained
  `disposable-email-domains` blocklist, and separately rejects domains with no
  mail server (MX record) at all — this catches most throwaway/temp-mail sites,
  including new ones not yet in any blocklist.
- Email + phone must each be verified with a one-time code before login works.
- Registration, login, and OTP endpoints are all rate-limited per IP/email via
  Upstash so scripted signup/brute-force attempts get throttled automatically.
