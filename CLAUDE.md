# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite web application that counts down to Sir David Attenborough's 100th birthday (May 8, 2026). It's a school project featuring a countdown timer and information about David Attenborough's career and achievements.

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

### Project Structure
- `/src/components/` - React components
- `/public/images/attenborough/` - David Attenborough images (various formats: .jpg, .webp, .avif)
- `/src/App.jsx` - Main application component
- `/src/main.jsx` - Application entry point

### Image Assets
The project includes multiple nature-themed images of animals and David Attenborough in `/public/images/attenborough/`. Images can be referenced in components using the path `/images/attenborough/filename.ext`.

## Deployment

This project is designed to deploy to Vercel via GitHub integration. When code is pushed to the main branch, Vercel automatically builds and deploys the static site.
