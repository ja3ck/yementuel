# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yementuel (예맨틀) is a Korean word-guessing web application where users try to guess a daily target word. The app calculates and displays cosine similarity between user guesses and the target word, providing a ranked list of guesses to help users find the answer.

## Key Requirements

### Core Features
- **Word Guessing Game**: Users input Korean words (2+ characters) to guess the daily target
- **Cosine Similarity**: Calculate and display similarity scores between guesses and target word
- **Leaderboard**: Show user guesses ranked by similarity score
- **Daily Word**: One target word per day, changeable through admin dashboard
- **Responsive Design**: Must work seamlessly on both PC and mobile devices
- **Captcha Hint Feature**: 사용자가 포기하고 정답을 맞추길 원하면 Capcha 를 풀고 버튼을 누르면 정답을 제공해야합니다.

### Authentication
- Admin authentication required for dashboard access
- Regular users play without authentication

### Technical Considerations
- Korean language support is essential
- Word embeddings or similar NLP model needed for cosine similarity calculations
- Consider using Korean word vectors (e.g., FastText Korean, Word2Vec Korean models)
- Database needed to store daily words and possibly user guesses

## Development Commands

### Setup
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd client && npm install
```

### Development
```bash
# Run both frontend and backend in development mode
npm run dev

# Run only server
npm run server:dev

# Run only client  
npm run client:dev
```

### Build
```bash
# Build both frontend and backend
npm run build

# Build only server
npm run server:build

# Build only client
npm run client:build
```

### Environment Variables
- Server: Copy `server/.env.example` to `server/.env` and update values
- Client: Copy `client/.env.example` to `client/.env` and update values

## Architecture Guidelines

### Current Implementation
- **Frontend**: React with TypeScript and Tailwind CSS
  - Components: Header, WordInput, WordList, GiveUpButton
  - Simple and cozy design with warm colors
  - CAPTCHA integration for answer reveal
  
- **Backend**: Express.js with TypeScript
  - Routes: `/api/words` (game logic), `/api/admin` (admin features)
  - Services: wordService, adminService, nlpService
  - JWT authentication for admin
  
- **NLP Service**: Currently using mock implementation
  - TODO: Integrate FastText Korean pre-trained model
  - Cosine similarity calculation between word vectors
  
- **Data Storage**: SQLite database for persistent storage
  - Tables: daily_words, word_attempts, admin_users
  - Automatic database initialization on startup

### Next Steps
1. Integrate FastText Korean model for real similarity calculations
2. Implement admin dashboard UI
3. Add daily word rotation logic
4. Deploy with Docker

### Current Status
- ✅ Basic game functionality implemented
- ✅ SQLite database integration
- ✅ Custom CAPTCHA for answer reveal
- ✅ Responsive design with Tailwind CSS
- ⚠️ Using mock similarity calculations (needs FastText integration)
- ❌ Admin dashboard UI not implemented
- ❌ Daily word auto-rotation not implemented