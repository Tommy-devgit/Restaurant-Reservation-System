# Restaurant Reservation System (Multi-Tenant SaaS)

Production-style MVP for real-time table reservations built with Next.js, Firebase, and Tailwind CSS.

## Features

- Multi-tenant data model by `restaurantId`
- Real-time reservation updates with Firestore listeners
- Double-booking prevention with interval conflict logic
- Auto table assignment by smallest-fit capacity
- Customer booking flow:
	- Restaurant list
	- Slot and availability check
	- Booking form
	- Confirmation and cancellation
- Admin dashboard:
	- Dashboard metrics
	- Tables CRUD
	- Reservations list + filters + cancellation
	- Restaurant settings and working hours

## Core Booking Rule

Time conflict is detected with:

`newStart < existingEnd && newEnd > existingStart`

If true, reservation conflicts and cannot be created.

## Tech Stack

- Frontend: Next.js App Router + Tailwind CSS
- Backend: Firebase Firestore + Firebase Auth
- State/Fetching: TanStack React Query + Zustand
- Validation: Zod + React Hook Form

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure env variables:

```bash
cp .env.example .env.local
```

3. Set Firebase values in `.env.local`.

4. Run app:

```bash
npm run dev
```

## Firestore Configuration

- Security rules file: `firestore.rules`
- Composite indexes file: `firestore.indexes.json`

Deploy using Firebase CLI in your project.

## Recommended Firestore Collections

- `users`
- `restaurants`
- `tables`
- `reservations`

See `types/domain.ts` for document contracts.

## Folder Overview

- `app/`: customer + admin pages
- `components/`: UI building blocks
- `services/`: Firestore query/mutation layer
- `hooks/`: query and realtime hooks
- `lib/`: Firebase bootstrap + time utilities
- `types/`: domain models

## Performance Notes

- Availability checks query only `restaurantId + date` data
- Composite indexes optimize reservation and table lookups
- Query caching enabled via React Query default options

## MVP Roadmap Alignment

- Phase 1: Auth-ready structure, tables CRUD, reservation logic, availability check
- Phase 2: Admin dashboard, slot generation, auto-assignment
- Phase 3 (future): analytics, notifications, billing
