# reCAPTCHA v3 Setup Instructions

## Step 1: Get reCAPTCHA Keys

1. Go to https://www.google.com/recaptcha/admin/create
2. Register a new site with these settings:
   - **Label**: David Attenborough Birthday Site
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**:
     - `localhost` (for testing)
     - Your Vercel domain (e.g., `davidattenboroughcountdownclock.vercel.app`)
   - Accept the terms
3. Click "Submit"

You'll receive:
- **Site Key** (public, goes in frontend)
- **Secret Key** (private, goes in Vercel env vars)

## Step 2: Update Frontend

In `index.html` (at the project root), add the reCAPTCHA scripts to the `<head>` section with your **Site Key**:

```html
<!-- reCAPTCHA v3 -->
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY_HERE"></script>
<script>
  window.RECAPTCHA_SITE_KEY = 'YOUR_SITE_KEY_HERE';
</script>
```

✅ **Already completed** - Your Site Key has been added to index.html

## Step 3: Add Secret Key to Vercel

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `RECAPTCHA_SECRET_KEY`
   - **Value**: Your Secret Key from Google
   - **Environments**: Production, Preview, Development

## Step 4: Deploy

Commit and push your changes to trigger a deployment.

## How It Works

- **reCAPTCHA v3** is invisible - no checkbox for users
- Runs in background when they click "Generate Birthday Wish"
- Scores users from 0.0 (bot) to 1.0 (human)
- We reject scores below 0.5
- Combined with honeypot field and session limiting for multi-layer protection
