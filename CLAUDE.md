# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yementuel (예맨틀) is a Korean word-guessing web application built with Next.js. Users try to guess a daily target word by receiving cosine similarity scores for their attempts. The app provides a ranked list of guesses to help users find the answer.

## Key Features

### Core Functionality
- **Word Guessing Game**: Users input Korean words (2+ characters) to guess the daily target
- **Cosine Similarity**: Calculate and display similarity scores between guesses and target word
- **Leaderboard**: Show user guesses ranked by similarity score
- **Daily Word**: One target word per day, changeable through admin dashboard
- **Responsive Design**: Works seamlessly on both PC and mobile devices
- **CAPTCHA Protection**: Custom canvas-based CAPTCHA for answer reveal

### Architecture
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS with cozy design (warm colors, rounded corners)
- **Database**: SQLite with better-sqlite3 for persistent storage
- **Authentication**: JWT-based admin authentication
- **API Routes**: RESTful API integrated within Next.js

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables
- Copy `.env.local.example` to `.env.local` and update values
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment (development/production)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── words/          # Game API endpoints
│   │   └── admin/          # Admin API endpoints
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main game page
├── components/
│   ├── Header.tsx          # App header
│   ├── WordInput.tsx       # Word input form
│   ├── WordList.tsx        # List of attempted words
│   ├── GiveUpButton.tsx    # Answer reveal with CAPTCHA
│   └── SimpleCaptcha.tsx   # Custom CAPTCHA component
└── lib/
    ├── database.ts         # SQLite database setup and queries
    ├── wordService.ts      # Word game logic
    ├── adminService.ts     # Admin authentication
    └── nlp.ts             # NLP similarity calculations (mock)
```

## API Endpoints

### Public Endpoints
- `POST /api/words/check` - Check word similarity
- `GET /api/words/list` - Get today's word attempts
- `POST /api/words/reveal-answer` - Reveal answer (with CAPTCHA)

### Admin Endpoints (Authenticated)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/daily-word` - Get current daily word
- `PUT /api/admin/daily-word` - Set new daily word

## Database Schema

### Tables
- `daily_words`: Stores daily target words
- `word_attempts`: Records all user attempts with similarity scores
- `admin_users`: Admin user credentials (default: admin/admin123)

## Current Status

### ✅ Completed Features
- Next.js project with TypeScript and Tailwind CSS
- SQLite database integration with automatic initialization
- Word guessing game with similarity scoring
- Custom canvas-based CAPTCHA system
- Responsive UI with loading states and error handling
- Admin authentication system
- RESTful API routes

### ⚠️ Pending Tasks
- Real Korean word similarity using FastText model
- Admin dashboard UI
- Daily word auto-rotation
- Performance optimizations

## Migration Benefits

This Next.js implementation provides several advantages over the previous Express + React setup:

1. **Unified Development**: Single `npm run dev` command
2. **Built-in API**: No separate server needed
3. **Optimized Build**: Automatic code splitting and optimization
4. **Easy Deployment**: Simple deployment to Vercel/Netlify
5. **Better DX**: Hot reloading, TypeScript support, and modern tooling

## Default Credentials
- Admin username: `admin`
- Admin password: `admin123`
- Default daily word: `사과`