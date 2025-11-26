# New Features Implementation Plan

## Overview
Adding two new features to the David Attenborough Countdown Clock:
1. **Site Visitor Counter** - Track and display total number of visitors
2. **AI-Generated Birthday Wishes** - Allow visitors to generate and post birthday wishes using Claude API

## Database Schema
Located in `scripts/setup-db.js`:

### visitor_stats table
- `id` (INTEGER PRIMARY KEY) - Always 1 (single row)
- `count` (INTEGER) - Total visitor count

### wishes table
- `id` (SERIAL PRIMARY KEY) - Auto-incrementing ID
- `message` (TEXT NOT NULL) - The birthday wish message
- `visitor_name` (VARCHAR(100)) - Optional visitor name
- `created_at` (TIMESTAMP) - Auto-generated timestamp

## Environment Variables Required
- `DATABASE_URL` - Neon Postgres connection string (already configured in Vercel)
- `ANTHROPIC_API_KEY` - Claude API key for generating wishes (needs to be added to Vercel)

## Implementation Checklist

### Backend - API Routes (in `/api` directory)

- [x] **GET /api/visitors** - Retrieve current visitor count
  - Query visitor_stats table
  - Return { count: number }

- [x] **POST /api/visitors** - Increment visitor count
  - Increment count in visitor_stats
  - Return updated { count: number }

- [x] **GET /api/wishes** - Retrieve all birthday wishes
  - Query wishes table ordered by created_at DESC
  - Return array of wish objects with pagination support

- [x] **POST /api/wishes** - Generate and save new birthday wish
  - Accept: { visitorName?: string }
  - Call Anthropic Claude API to generate a creative birthday wish
  - Save to wishes table
  - Return the generated wish

### Frontend - React Components

- [x] **VisitorCounter component** (`src/components/VisitorCounter.jsx`)
  - Fetches visitor count on mount
  - Increments count on first visit (use sessionStorage to track)
  - Displays count with appropriate styling

- [x] **BirthdayWishes component** (`src/components/BirthdayWishes.jsx`)
  - Form to generate wish (optional name input)
  - "Generate Wish" button that calls Claude API
  - Display generated wish with option to save
  - List of all saved wishes (with pagination/infinite scroll)
  - Loading states and error handling

- [x] **Integration into App.jsx**
  - Import and render VisitorCounter component
  - Import and render BirthdayWishes component
  - Add appropriate styling/layout

### Styling
- [x] Add CSS for new components
- [x] Ensure responsive design matches existing theme
- [x] Add loading spinners/states for API calls

### Documentation
- [x] Update CLAUDE.md with new architecture details
- [x] Document API endpoints
- [x] Document environment variable requirements

## Technical Decisions

### AI Service Choice
✅ **Selected: Anthropic Claude API**
- Provides creative, contextual birthday wishes
- Good at understanding prompts about David Attenborough's legacy

### Visitor Tracking Strategy
- Use sessionStorage to prevent double-counting on same session
- Increment on component mount if not already counted
- Simple counter (no analytics/IP tracking for privacy)

### Wishes Display
- Show most recent wishes first
- Consider pagination or "load more" if wishes grow large
- Display visitor name (if provided) with each wish

## Next Steps for Deployment

1. **Run database setup** (if not already done):
   ```bash
   DATABASE_URL=your_neon_connection_string node scripts/setup-db.js
   ```

2. **Add environment variables in Vercel**:
   - Go to Vercel project settings → Environment Variables
   - Add `ANTHROPIC_API_KEY` (if not already present, `DATABASE_URL` should already be configured)

3. **Test locally** (optional):
   ```bash
   npm run dev
   ```
   - Note: API routes won't work locally without Vercel CLI or proper serverless function setup

4. **Deploy to Vercel**:
   - Commit and push changes to GitHub
   - Vercel will automatically build and deploy

5. **Test production deployment**:
   - Visit the live site
   - Test visitor counter increments
   - Generate a birthday wish
   - Verify wishes are saved and displayed

## Progress Tracking
Start Date: 2025-11-26
Status: ✅ **IMPLEMENTATION COMPLETE** - Ready for Deployment

### Completed Tasks
- [x] Database schema created (setup-db.js)
- [x] Neon database provisioned in Vercel
- [x] Implementation plan documented
- [x] Created `/api/visitors.js` API route
- [x] Created `/api/wishes.js` API route with Claude integration
- [x] Created `VisitorCounter` component with styling
- [x] Created `BirthdayWishes` component with styling
- [x] Integrated both components into App.jsx
- [x] Updated CLAUDE.md documentation

### Current Task
- [ ] Deploy to Vercel and configure ANTHROPIC_API_KEY
- [ ] Test production deployment
