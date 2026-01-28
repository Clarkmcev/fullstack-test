# Event Log Dashboard - Take-Home Challenge

## Overview

Build a simple event logging system with a Go backend and React frontend. Users should be able to submit events and view
them in a filterable list.

**Time expectation:** 3-4 hours maximum. We value working software over polish—it's fine to cut corners, just note what
you'd improve.

## Requirements

### Backend (Go)

- `POST /events` — create an event with `type` (string), `payload` (JSON object), and `timestamp` (auto-generated)
- `GET /events` — list events, with optional filtering by `type` and date range
- Persist events to SQLite or another relational database
- Include at least one meaningful test

### Frontend (React + TypeScript)

- Form to submit a new event (type + freeform JSON payload)
- Table/list displaying events with:
    - Filter by event type
    - Filter by date range
- No need for authentication or styling beyond basic usability

## Project Structure

This template provides a minimal starting point. Feel free to change anything; add dependencies, restructure folders,
swap out libraries, or rewrite from scratch if you prefer. We're interested in your solution, not adherence to this
scaffold.

## Getting Started

### Backend

```bash
cd backend
go run .
# Server runs on http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## What We're Looking For

- **Working code** that we can run locally
- **Reasonable structure** — navigable, not necessarily perfect
- **Your judgment** — make assumptions where needed, just document them

## Deliverables

1. This repo with your implementation
2. Your answers to the questions below
3. Be prepared for a 15-30-minute walkthrough where we'll discuss your decisions and possibly make a small modification
   together

---

## Your Answers

Please fill these out before submitting.

### 1. What trade-offs did you make and why?

_Your answer here_

### 2. If this needed to handle 10,000 events per second, what would you change?

_Your answer here_

### 3. What's one thing you'd add or refactor given another few hours?

_Your answer here_