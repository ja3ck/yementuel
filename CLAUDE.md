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
- `GET /api/admin/daily-word` - Get all daily words list
- `POST /api/admin/daily-word` - Add new daily word

## Database Schema

### Tables
- `daily_words`: Stores daily target words with dates
- `word_attempts`: Records all user attempts with similarity scores
- `admin_users`: Admin user credentials (email-based authentication)

## Current Status

### ✅ Completed Features
- Next.js project with TypeScript and Tailwind CSS
- SQLite database integration with automatic initialization
- Word guessing game with similarity scoring
- Custom canvas-based CAPTCHA system (dual-button layout)
- Responsive UI with loading states and error handling
- Complete admin authentication system with email-based login
- Admin dashboard with daily word management
- RESTful API routes for both game and admin functionality
- Database file exclusion in .gitignore
- Clean project structure (removed old Express+React implementation)

### ⚠️ Pending Tasks
- Real Korean word similarity using FastText model
- Daily word auto-rotation logic
- Performance optimizations

## Migration Benefits

This Next.js implementation provides several advantages over the previous Express + React setup:

1. **Unified Development**: Single `npm run dev` command
2. **Built-in API**: No separate server needed
3. **Optimized Build**: Automatic code splitting and optimization
4. **Easy Deployment**: Simple deployment to Vercel/Netlify
5. **Better DX**: Hot reloading, TypeScript support, and modern tooling

## Admin Access
- **Login URL**: `http://localhost:3001/admin`
- **Email**: `admin@yementuel.com`
- **Password**: `admin123`
- **Dashboard**: `http://localhost:3001/admin/dashboard`

## Game Access
- **Main Game**: `http://localhost:3001/`
- **Default Daily Word**: `사과`

## Development Notes
- Server runs on port 3001 (when 3000 is occupied)
- Database auto-initializes on first run
- Admin dashboard allows adding daily words with specific dates
- CAPTCHA required for answer reveal (포기하기 feature)

## User Experience Improvements
- **Anonymous User Tracking**: 로그인하지 않은 사용자라도 쿠키나 세션 정보를 통해서 시도한 단어들을 분리해서 보여주세요

## Similarity Calculation
- 단어 유사도 계산은 FAISS 를 사용해주세요 