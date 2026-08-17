# Backend README

## Overview

This backend provides a product management API with a PostgreSQL database and AI tag generation via the OpenAI API. Products are persisted with Prisma and validated through Zod schemas and centralized Express middleware.

## Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Zod
- dotenv

## Setup

1. Copy `.env.example` to `.env`.
2. Configure `DATABASE_URL` and `AI_API_KEY`.
3. Install dependencies: `npm install`.
4. Run Prisma migration: `npx prisma migrate dev --name init`.
5. Generate Prisma client: `npx prisma generate`.

## Run

```bash
npm run dev
```

## Core API

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/generate-tags`

## Notes

- Product names are unique case-insensitively.
- Generated tags are normalized to lowercase before storage.
- All errors use a JSON envelope with `success` and `message`.
