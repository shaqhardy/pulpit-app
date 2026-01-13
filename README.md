# Pulpit - Speaker Booking Platform

A booking platform for speakers, worship leaders, and event hosts.

## Tech Stack

- **Frontend:** Next.js 14 + React
- **Backend:** Xano (API + Database)
- **Hosting:** Vercel

## Xano API

Base URL: `https://x8ki-letl-twmt.n7.xano.io/api:EoXk01e5`

## Deploy to Vercel

### Option 1: One-Click Deploy

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm install -g vercel
cd pulpit-app
vercel
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- ✅ User authentication (signup/login)
- ✅ Dashboard with stats
- ✅ Booking requests management
- ✅ Messaging
- ✅ Profile management
- ✅ Document storage
- ✅ Resources for event hosts
- ✅ Team member invites
- ✅ Notification settings
- ✅ PWA support (Add to Home Screen)

## Database Tables (Xano)

- users
- booking_requests
- messages
- documents
- itinerary_items
- follows
- notifications
- resources
- media_requests
- team_members
- speaker_availability

## API Endpoints

All CRUD operations available for each table:
- GET /[table] - List all
- GET /[table]/{id} - Get one
- POST /[table] - Create
- PATCH /[table]/{id} - Update
- DELETE /[table]/{id} - Delete

Authentication:
- POST /auth/signup
- POST /auth/login
- GET /auth/me
