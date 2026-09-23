# ZIVOR Marketing Agency Website

A responsive performance-marketing website for **ZIVOR**, with a connected lead-generation form and Supabase backend.

## Pages

- `index.html` — Main marketing website and lead-generation form.
- `landing.html` — Post-submission confirmation landing page. Successful form submissions redirect here.
- `services.html` — Dedicated services page for Meta Ads, Google Ads, creative, social media, landing pages/CRO, and analytics.

## Features

- Responsive marketing agency website
- Meta Ads, Google Ads, creative, social media, landing-page and analytics services
- Conversion-focused lead form
- Supabase lead capture
- RLS enabled on the `public.leads` table
- Public visitors can submit leads but cannot read stored leads
- Submission loading, success and error states
- Automatic redirect to `landing.html?submitted=1` after a successful submission
- Basic SEO and Open Graph metadata

## Supabase

Project: **zivor GPT**  
Project ref: `iwmerosfwaklwqavpkqo`

The frontend uses a Supabase **publishable** key. Publishable keys are intended for browser applications when Row Level Security is configured correctly.

**Never place a Supabase service-role or secret key in frontend code or commit it to GitHub.**

The database schema is stored in:

`supabase/schema.sql`

## Lead fields

- Full name
- Business name
- Email
- Phone / WhatsApp
- Service
- Monthly ad budget
- Goals / message

## Run locally

Open `index.html` in a browser, or use a simple local server such as VS Code Live Server.

## Deployment

This is a static website and can be deployed to GitHub Pages, Vercel, Netlify, or another static hosting provider.

For GitHub Pages, make sure the repository is configured to publish the `main` branch.

## Lead flow

1. Visitor opens `index.html`.
2. Visitor fills in the lead form.
3. JavaScript sends the form data to Supabase.
4. Supabase stores the lead in `public.leads`.
5. On success, the visitor is redirected to `landing.html?submitted=1`.

## Security

RLS is enabled on `public.leads`. The current public policy allows INSERT for `anon` and `authenticated` users but does not provide a public SELECT policy, preventing website visitors from reading submitted leads through the client.



## Authentication

- auth.html — Sign-up and sign-in page.
- auth-guard.js — Protects the main website pages so users must be authenticated first.
- auth.js — Supabase email/password authentication and password reset.
- Supabase Auth handles passwords; public.signups stores email and signup timestamp, never the password.
- public.signups uses RLS and users can only read their own signup record.
- The browser form enforces a minimum password length of 8 characters. Set the Supabase Auth email-provider minimum password length to 8 in the dashboard as server-side enforcement too.

## Cookie banner and GTM

- A cookie banner appears on first visit with Accept/Decline choices.
- Google Tag Manager GTM-5L5R8XZ7 loads only after optional cookie/analytics consent is accepted.
- The cookie choice is stored in browser local storage.

## WhatsApp

- site.js contains the floating WhatsApp button.
- Set WHATSAPP_NUMBER in site.js to the ZIVOR business number in international format (digits only) to open a direct chat. Without a configured number, the button opens WhatsApp Web.
