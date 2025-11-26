# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite web application that counts down to Sir David Attenborough's 100th birthday (May 8, 2026). It's a school project featuring a countdown timer and information about David Attenborough's career and achievements.

## Active Development

**IMPORTANT**: Check `new-features-tracker.md` in the project root for the current implementation plan and progress. When starting a new session:
1. Read `new-features-tracker.md` to understand what features are being added
2. Check which tasks are completed vs. pending
3. Continue from where the previous session left off
4. Update the progress tracker as you complete tasks

## Development Commands

```bash
# Start development server with hot module reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Architecture

### Tech Stack
- **React 19.2.0** - UI framework
- **Vite 7.2.2** - Build tool and dev server
- **ESLint** - Code linting
- **Neon Postgres** - Serverless database for visitor tracking and wishes
- **Anthropic Claude API** - AI-powered birthday wish generation

### Project Structure
- `/src/App.jsx` - Main application component with countdown and image grid
- `/src/components/VisitorCounter.jsx` - Visitor counter display component
- `/src/components/BirthdayWishes.jsx` - Birthday wishes generator and display
- `/src/main.jsx` - Application entry point
- `/api/visitors.js` - Vercel serverless function for visitor counting
- `/api/wishes.js` - Vercel serverless function for wish generation and retrieval
- `/scripts/setup-db.js` - Database initialization script
- `/public/Images/attenborough/` - David Attenborough images (various formats: .jpg, .webp, .avif)

**Note**: The images directory uses a capital 'I' (`/Images/`) in the path. Images are referenced as `/Images/attenborough/filename.ext`.

### Application Features
- **Countdown Timer**: Updates every second, calculating time remaining until May 8, 2026
- **Dynamic Image Grid**: Displays 17 nature-themed images in a grid layout
- **Image Rotation**: Every 5 seconds, two random images swap positions with an 800ms fade transition
- **Celebrate Button**: Triggers a 10-second celebration mode that shows a birthday message and sets the countdown to zero
- **Visitor Counter**: Tracks total site visitors using sessionStorage to prevent double-counting
- **AI Birthday Wishes**: Generates personalized birthday wishes using Claude API, saved to database

### Database Schema
Two tables in Neon Postgres:
- **visitor_stats**: Single row tracking total visitor count
- **wishes**: Stores generated birthday wishes with optional visitor names and timestamps

## Environment Variables

Required environment variables in Vercel:
- `DATABASE_URL` - Neon Postgres connection string
- `ANTHROPIC_API_KEY` - Claude API key for generating birthday wishes

## API Endpoints

- **GET /api/visitors** - Retrieve current visitor count
- **POST /api/visitors** - Increment visitor count and return new total
- **GET /api/wishes** - Retrieve all birthday wishes (limit 50, most recent first)
- **POST /api/wishes** - Generate AI birthday wish and save to database
  - Body: `{ visitorName?: string }`
  - Returns: Generated wish object

## Deployment

This project is designed to deploy to Vercel via GitHub integration. When code is pushed to the main branch, Vercel automatically builds and deploys the static site.

### First-time Database Setup
Run `node scripts/setup-db.js` with DATABASE_URL environment variable to initialize the database tables.
