# Product Management System + AI Tag Generator

A full-stack product management application built with Node.js, TypeScript, Express, PostgreSQL, Prisma, and Next.js. It allows users to create products, view details, delete products, and generate AI-powered tags that are normalized and stored in PostgreSQL.

## Features

- Create products with name and description
- Validate duplicate names case-insensitively
- View all products
- View a single product detail page
- Delete products
- Generate 3–5 product tags using OpenAI
- Store normalized lowercase tags in the database
- Responsive, two-page Next.js frontend
- Centralized backend validation and error handling
- Production-ready structure for a 48-hour technical assignment

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Zod
- dotenv

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Native fetch

### AI
- OpenAI API (Chat Completions)

## Architecture Overview

The project follows a layered architecture with separation of concerns:

- `backend/src/routes` — HTTP route definitions
- `backend/src/controllers` — request/response handling
- `backend/src/services` — business logic
- `backend/src/middleware` — validation, logging, and error handling
- `backend/src/schemas` — Zod validation schemas
- `backend/src/lib` — helpers and shared utilities
- `backend/src/config` — environment and Prisma config

## Project Structure

```text
product-management-ai/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── prisma.ts
│   │   ├── controllers/
│   │   │   └── productController.ts
│   │   ├── lib/
│   │   │   ├── errors.ts
│   │   │   ├── tagUtils.ts
│   │   │   └── tagUtils.test.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   ├── requestLogger.ts
│   │   │   └── validate.ts
│   │   ├── routes/
│   │   │   └── productRoutes.ts
│   │   ├── schemas/
│   │   │   └── productSchema.ts
│   │   └── services/
│   │       └── productService.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── README.md
├── .gitignore
├── README.md
└── .env.example
```

## Database Setup

1. Install PostgreSQL locally.
2. Create a database, for example:

```bash
createdb product_management
```

3. Update the backend `.env` file with your `DATABASE_URL`.
4. Run Prisma migrations:

```bash
cd backend
npx prisma migrate dev --name init
```

5. Generate Prisma client:

```bash
npx prisma generate
```

## Environment Variables

Create a `.env` file in the backend root using the example provided:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/product_management"
AI_API_KEY="your-openai-key"
AI_MODEL="gpt-4o-mini"
FRONTEND_URL="http://localhost:3001"
```

Frontend environment example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> The AI API key is never exposed to the frontend and should not be committed to GitHub.

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## How to Run Backend

```bash
cd backend
npm run dev
```

Backend API runs on:

- http://localhost:3000

## How to Run Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

- http://localhost:3001

## API Documentation

### Base URL

```text
http://localhost:3000/api
```

### Endpoints

1. `POST /api/products`
   - Create a new product
2. `GET /api/products`
   - Fetch all products
3. `GET /api/products/:id`
   - Fetch one product by id
4. `DELETE /api/products/:id`
   - Delete a product
5. `POST /api/products/:id/generate-tags`
   - Generate and store AI tags for a product

### Response Format

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Product name already exists"
}
```

## Postman Testing

Use Postman to test the following required scenarios:

1. Create Product
2. Create Duplicate Product
3. Get All Products
4. Get Product By ID
5. Get Non-existing Product
6. Delete Product
7. Generate Product Tags
8. Invalid Request Validation

These scenarios should be documented with screenshots showing request and response payloads for the assignment submission.

## AI API Used

This project uses the OpenAI API for tag generation. The backend calls the AI provider from the server side only. The API key is stored in environment variables and never exposed to the frontend.

## AI Tag Generation Flow

1. Fetch the product by ID
2. Build a prompt using the product name and description
3. Ask the AI for 3–5 short product tags
4. Parse the response safely
5. Normalize every tag to lowercase
6. Store the tags to the database
7. Return the updated product JSON

## Database Schema

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  tags        String[] @default([])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

The application also performs case-insensitive duplicate checking to prevent variants like:

- Gaming Mouse
- gaming mouse
- GAMING MOUSE

## Screenshots

Add the Postman screenshots here or in a `docs/screenshots` folder before final submission.

Recommended structure:

```text
docs/
  ├── postman-create-product.png
  ├── postman-duplicate-product.png
  ├── postman-get-products.png
  ├── postman-get-product-by-id.png
  ├── postman-delete-product.png
  ├── postman-generate-tags.png
  └── postman-invalid-request.png
```

## Deployment Instructions

### Frontend (Vercel)

- Import the `frontend` folder into Vercel
- Set `NEXT_PUBLIC_API_URL` to the deployed backend API URL

### Backend (Render/Railway/Fly.io)

- Deploy the `backend` service
- Set `DATABASE_URL`, `AI_API_KEY`, and `PORT`
- Add CORS configuration for the frontend origin

### Database

- Use a managed PostgreSQL service
- Update `DATABASE_URL` in the production environment

## Live Demo

No live demo is included in this local workspace version. If deployed later, add the URL here.

## GitHub Preparation

The project is arranged as a monorepo and is ready to be initialized as a Git repository with a clean `.gitignore` and no secret files committed.

```bash
git init
git add .
git commit -m "Initial commit"
```

## Remaining TODO

- Install dependencies in a network-enabled environment
- Run Prisma migration and generate client
- Start backend and frontend locally
- Capture Postman screenshots for assignment documentation
- Optionally deploy to a live environment

## License

This project is intended for technical assignment use and demonstration.
