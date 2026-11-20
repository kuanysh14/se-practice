# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use one fictional room and fictional booking data only; never use real room names or KBTU portal data.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps; bookings that only touch at an endpoint are allowed.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI validation feedback on desktop and mobile widths.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit any file in the project.
- Add packages when a task needs them.
- Do not add a login page, database, or backend persistence, and never commit secrets or `.env` files.

## Before you finish

- Run the tests (`npm test`) and ensure all tests pass before proposing acceptance.
- Do not run external deployments or publish to production.