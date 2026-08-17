# Frontend README

## Overview

The frontend is a Next.js application with exactly two main pages: the product list/create page and the product detail page.

## Stack

- Next.js
- TypeScript
- Tailwind CSS

## Setup

1. Copy `.env.example` to `.env.local`.
2. Confirm `NEXT_PUBLIC_API_URL` points to the backend API.
3. Install dependencies: `npm install`.

## Run

```bash
npm run dev
```

The app runs on `http://localhost:3001` by default.

## Pages

- `/` — product list and creation form
- `/product/[id]` — product detail view

## UX Notes

- Loading states are displayed while fetching products.
- Delete and tag generation actions show feedback.
- The generate-tags button is hidden once tags exist.
