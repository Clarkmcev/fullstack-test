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

## Local environment

The repo use task for helper commands you can install it :

```
npm install -g @go-task/cli
```

## How to run

Build docker environment

```
task build
```

Run the containers

```
task up
```

## Your Answers

### 1. What trade-offs did you make and why?

- Manual DB initiation : It is simple and works for single-table schema and no migrations tools depencies needed. It might no be suited for teams environment, and can't version or rollback. To change if schema has to change and evolve frequently.
- Basic error handling : It is fast to implement, easy to read for use and doesn't expose internal info that can be sensitive to users. This is a good enough approach for a demo/coding challenge. This works well for a demo, but this will surely bring to confusion to people who will need to debug things.
- Docker setup : Easy setup to build and run the app, consistent environment across machines AND includes DB automatically. But this comes with the cost of slower development iteration (containers rebuild), and requires docker knowledge with more complex debugging.
- Basic event data input validation : I went for the minimal input validation, the backend doesn't include business logic validation for speed purposes, desc has no lenght limit, budget can be very large.
- Redux SAGA : Decided to introduce redux saga with redux toolkit to demonstrate my ability to work with complex state management patterns. This is definitely an overkill for simple CRUD operations because it comes with more boilerplate code than react queries or plain fetch. (but if the app comes to grow this is a must have)
- Storing data in both columns and payload : dedicated columns to enable fast sql filtering or indexing, satisfies requirement of storing payload (JSON object) but data duplication increase storage by ~2x, more complexity and must keep columns in sync with payload. To change if storage costs is significant or consistency issues
  arise.
- No pagination : The frontend handle the filtering/sorting locally for demo purposes, but response time will grow drastically with event count.

### 2. If this needed to handle 10,000 events per second, what would you change?

- Background job queue : To handle 10.000 events per second I would introduce a system design for high throughput, horizontal scalablity and durability (Kafka, RabbitMQ, Redis Streams) to process the requests asynchronously
- Response caching : Redis for caching GET /events, with a cache invalidation on POST /event requests to significantly reduce the database load.
- Database indexing : Data struct such as a B-tree to improve data retrieval. I never did such an implementation in the past but this could be a way to improve performances at the cost of an increase in storage space, complexity and maintenance.

### 3. What's one thing you'd add or refactor given another few hours?

- Full stack OPEN API contract with swagger OpenAPI : to use unified TypeScript and Go generated for models and APIs.

Thanks for reading, this was a cool little homework!
