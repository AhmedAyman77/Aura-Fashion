# E-Commerce Store TS

Full-stack e-commerce application with a React client and a TypeScript/Express backend. The backend is the main architectural core of this project: it handles authentication, product management, cart state, coupon validation, Stripe checkout, database migrations, Redis-backed token/caching flows, Cloudinary uploads, Elasticsearch product search, Swagger documentation, and OAuth login.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Overview](#backend-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Design Patterns](#design-patterns)
- [Database](#database)
- [APIs](#apis)
- [Swagger](#swagger)
- [Security](#security)
- [Zod Validation](#zod-validation)
- [RAG](#rag)
- [Notes](#notes)

## Overview
This repository contains two applications:

1. `client/`
   React + Vite storefront with product browsing, cart management, checkout flow, admin UI, and an AI chat page.
2. `server/`
   Express + TypeScript API that powers the application.

The backend is written in a layered style:

- Routes receive HTTP requests.
- Controllers contain request/response logic.
- DAOs isolate persistence logic from business logic.
- Database connections abstract the selected SQL engine.
- Config modules centralize third-party integrations like Stripe, Redis, Cloudinary, Passport, Swagger, and Elasticsearch.

The result is a backend that is easier to switch between databases, easier to extend, and easier to document.

## Tech Stack
### Frontend
- React 19
- Vite
- Zustand
- Axios
- React Router
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express
- TypeScript
- JWT authentication with cookies
- Passport OAuth for Google and GitHub
- Redis
- Stripe
- Cloudinary
- Elasticsearch
- Swagger UI / OpenAPI
- Zod + `zod-express-middleware`
- Arcjet + Helmet

### Databases
- SQLite
- SQLite Cloud
- SQL Server

## Project Structure
```text
.
├── client
│   ├── public
│   └── src
│       ├── components
│       ├── lib
│       ├── pages
│       └── stores
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── databases
│   │   │   ├── connection
│   │   │   ├── DAO
│   │   │   ├── implementations
│   │   │   └── migrations
│   │   ├── middlewares
│   │   ├── routes
│   │   └── types
│   └── ERD.md
└── README.md
```

### Important Backend Folders
- `server/src/Application.ts`
  Main application bootstrap class. Configures middleware, routes, Swagger, DB initialization, Elasticsearch sync, server startup, and graceful shutdown.
- `server/src/routes`
  Defines public API endpoints and route-level middleware.
- `server/src/controllers`
  Contains feature logic for auth, products, cart, coupons, payments, and OAuth callbacks.
- `server/src/databases/DAO`
  Abstract DAO contracts for users, products, orders, and coupons.
- `server/src/databases/implementations`
  Concrete DAO implementations for SQLite and SQL Server, plus Elasticsearch product search support.
- `server/src/databases/migrations`
  Custom migration system and schema evolution files.
- `server/src/middlewares`
  Auth, validation, rate limiting, security headers, async error wrapping, and centralized error handling.
- `server/src/config`
  All integration-specific setup for env loading, DB selection, Stripe, Redis, Swagger, Passport, Cloudinary, Multer, and Elasticsearch.

## Backend Overview
The backend starts from `server/src/app.ts`, which instantiates `Application` and calls `start()`.

During startup, the server:

1. Registers middleware:
   - CORS with credentials support
   - Helmet security headers
   - Arcjet rate limiting
   - JSON body parsing with a 10 KB limit
   - Cookie parsing
   - Passport initialization
   - Swagger UI at `/api-docs`
2. Registers feature routes:
   - `/api/auth`
   - `/api/products`
   - `/api/cart`
   - `/api/coupons`
   - `/api/payments`
   - `/api/health`
3. Connects to the selected SQL database through the DAO factory.
4. Runs custom migrations through `MigrationManager`.
5. Connects to Elasticsearch and bulk-indexes existing products.
6. Starts the HTTP server and prints the Swagger URL.

### Request Flow
Most requests follow this flow:

`Route -> middleware -> controller -> DAO -> database`

Examples:
- `POST /api/auth/login`
  Runs rate limit + Zod validation, then the auth controller verifies credentials, generates tokens, stores the refresh token in Redis, and sets secure cookies.
- `POST /api/products`
  Requires an authenticated admin, accepts an uploaded image through Multer, uploads it to Cloudinary, stores the product through the SQL DAO, then indexes the product in Elasticsearch.
- `POST /api/payments/checkout`
  Requires authentication, validates the payload, checks coupons, creates a Stripe session, and returns the checkout URL.

## Getting Started
### 1. Install Dependencies
Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd server
npm install
```

### 2. Create Environment Files
Create a `.env` file inside `server/` with the variables your chosen setup needs.

Minimal local example:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

SQL_TYPE=sqlite
SQLITE_DB_PATH=./database.sqlite

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

STRIPE_SECRET=sk_test_xxx

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

ELASTICSEARCH_railWay_URL=http://localhost:9200

ARCJET_KEY=your_arcjet_key

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

If you want SQL Server instead of SQLite:

```env
SQL_TYPE=sqlserver
SQLSERVER_HOST=localhost
SQLSERVER_DATABASE=ecommerce
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=your_password
SQLSERVER_ENCRYPT=true
SQLSERVER_TRUST_CERT=true
```

If you want SQLite Cloud:

```env
SQL_TYPE=sqliteCloud
SQLITE_CONNECTION_STRING=your_sqlite_cloud_connection_string
```

### 3. Start the Backend
```bash
cd server
npm run dev
```

Default local API base URL:

```text
http://localhost:5000/api
```

### 4. Start the Frontend
```bash
cd client
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

### 5. Open Swagger
```text
http://localhost:5000/api-docs
```

If you change `PORT`, the Swagger URL becomes:

```text
http://localhost:<PORT>/api-docs
```

## Environment Variables
### Core App
- `NODE_ENV`
- `PORT`
- `CLIENT_URL`

### JWT
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

### Database Selection
- `SQL_TYPE`

### SQLite
- `SQLITE_DB_PATH`

### SQLite Cloud
- `SQLITE_CONNECTION_STRING`

### SQL Server
- `SQLSERVER_HOST`
- `SQLSERVER_DATABASE`
- `SQLSERVER_USER`
- `SQLSERVER_PASSWORD`
- `SQLSERVER_ENCRYPT`
- `SQLSERVER_TRUST_CERT`

### Redis
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

### Cloudinary
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Stripe
- `STRIPE_SECRET`

### Elasticsearch
- `ELASTICSEARCH_URL`
- `ELASTICSEARCH_railWay_URL`
- `ELASTICSEARCH_API_KEY`

### Arcjet
- `ARCJET_KEY`

### OAuth
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Design Patterns
This backend uses several useful patterns.

### 1. DAO Pattern
Persistence logic is abstracted into DAOs such as:

- `UserDAO`
- `ProductDAO`
- `OrderDAO`
- `CouponDAO`

Controllers do not directly write SQL. They work through DAO contracts, which makes the business layer more portable and easier to test or replace.

### 2. Abstract Factory Pattern
`DAOFactory` decides which concrete DAO implementation to provide based on `SQL_TYPE`.

That means the same controller code can work with:
- SQLite
- SQLite Cloud
- SQL Server

without rewriting controller logic.

### 3. Strategy Pattern
The migration system supports different execution strategies. The default safe strategy only runs migrations that have not already been executed. There is also a dry-run strategy in the migration manager.

### 4. Template Method Pattern
`MigrationManager` defines the overall migration workflow:

- initialize migration table
- load executed migrations
- run or roll back each migration in order
- wrap each migration in a transaction

The algorithm stays consistent even if the execution strategy changes.

### 5. Middleware-Based Cross-Cutting Concerns
Authentication, validation, security headers, rate limiting, and error handling are implemented as middleware, which keeps route definitions clean and keeps repeated logic centralized.

### 6. Singleton Pattern
`DAOFactory.getInstance()` ensures one shared DAO factory instance across the application lifecycle.

## Database
The project supports relational storage through an abstraction layer.

### Supported Engines
- SQLite
- SQLite Cloud
- SQL Server

### Current Data Model
#### `users`
- `_id`
- `name`
- `email`
- `password`
- `role`
- `cartItems`
- `oauthProvider`
- `oauthId`
- `createdAt`
- `updatedAt`

`cartItems` is stored as JSON text in the database and mapped back to typed objects inside the DAO layer.

#### `products`
- `_id`
- `name`
- `description`
- `price`
- `image`
- `category`
- `isFeatured`
- `createdAt`
- `updatedAt`

#### `orders`
- `_id`
- `user`
- `products`
- `totalAmount`
- `stripeSessionId`
- `createdAt`
- `updatedAt`

`products` is stored as JSON text and contains order snapshots with product ID, quantity, and price.

#### `coupons`
- `_id`
- `code`
- `discountPercentage`
- `expirationDate`
- `isActive`
- `userId`
- `createdAt`
- `updatedAt`

### Migrations
Migrations live in `server/src/databases/migrations/migrations`.

Current migration list:
- `001_create_users_table`
- `002_create_products_table`
- `003_create_orders_table`
- `004_create_coupons_table`
- `005_add_oauth_to_users`

What the migration system does:
- creates a `migrations` table if it does not exist
- records executed migration IDs
- runs migrations in ascending order
- wraps each migration in a transaction
- supports rollback

### DAO Details
The DAO layer is where SQL-specific behavior lives.

Important implementation details:
- IDs are generated with `uuid`
- timestamps are created in the DAO layer
- SQLite DAOs serialize arrays/objects into JSON for `cartItems` and `products`
- `toggleFeatured` updates product state in SQL, then the controller refreshes Redis cache and Elasticsearch
- when a product is deleted, the backend also removes it from all user carts and tries to remove its Cloudinary asset and Elasticsearch document

## APIs
All API routes are prefixed under `/api`.

### Health
- `GET /api/health`
  Returns service status, timestamp, and uptime.

### Auth
- `POST /api/auth/signup`
  Creates a customer account, hashes the password with `bcryptjs`, stores the user, creates JWTs, stores the refresh token in Redis, and sets cookies.
- `POST /api/auth/login`
  Verifies email/password and returns the authenticated user.
- `POST /api/auth/logout`
  Clears cookies and deletes the refresh token from Redis when possible.
- `POST /api/auth/refresh-token`
  Verifies the refresh token from cookies and rotates the access token.
- `GET /api/auth/profile`
  Returns the authenticated user profile.
- `GET /api/auth/google`
  Starts Google OAuth.
- `GET /api/auth/google/callback`
  Finishes Google OAuth and redirects back to the client.
- `GET /api/auth/github`
  Starts GitHub OAuth.
- `GET /api/auth/github/callback`
  Finishes GitHub OAuth and redirects back to the client.

### Products
- `GET /api/products`
  Returns all products from SQL storage.
- `GET /api/products/featured`
  Returns featured products, reading from Redis cache first.
- `GET /api/products/recommendations`
  Returns random product recommendations.
- `GET /api/products/category/:category`
  Returns products for one category.
- `GET /api/products/search?q=...&category=...`
  Runs Elasticsearch search with fuzzy matching and optional category filtering.
- `POST /api/products`
  Admin-only route. Accepts multipart form data, uploads the image with Multer + Cloudinary, stores the product in SQL, then indexes it in Elasticsearch.
- `DELETE /api/products/:id`
  Admin-only route. Deletes the product, removes featured cache entry if needed, removes the product from all user carts, deletes the Cloudinary image when possible, and removes the document from Elasticsearch.
- `PATCH /api/products/toggle-featured/:id`
  Admin-only route. Toggles `isFeatured`, refreshes Redis cache, and re-indexes the product in Elasticsearch.

### Cart
- `GET /api/cart`
  Returns the authenticated user's cart with expanded product data.
- `POST /api/cart`
  Adds a product to the cart.
- `PUT /api/cart/:productId`
  Updates quantity or removes the item if quantity is `0`.
- `DELETE /api/cart/:productId`
  Removes one product from the cart.

### Coupons
- `GET /api/coupons`
  Returns the currently active coupon for the authenticated user.
- `POST /api/coupons/apply`
  Validates coupon ownership, active state, and expiration date.

### Payments
- `POST /api/payments/checkout`
  Creates a Stripe Checkout session from submitted cart products and optional coupon code.
- `POST /api/payments/success`
  Finalizes checkout after payment by:
  - applying a Redis lock
  - preventing duplicate order creation
  - retrieving the Stripe session
  - creating the order
  - deactivating used coupons
  - issuing a gift coupon for high-value purchases
  - clearing the user's cart

### Notes About Current API Coverage
- The current backend does not expose analytics endpoints, even though the frontend contains an admin page and some older documentation referenced analytics. This README reflects the code that exists now.

## Swagger
Swagger is registered directly in the application bootstrap and served through `swagger-ui-express`.

Local Swagger URL:

```text
http://localhost:5000/api-docs
```

What Swagger currently gives you:
- endpoint listing
- request bodies
- schema models
- auth-aware documentation through `cookieAuth`

Swagger security is configured as cookie-based auth with the `accessToken` cookie.

## Security
The backend has multiple layers of protection.

### Authentication
- Access token in cookie or Bearer header
- Refresh token in secure HttpOnly cookie
- Refresh token copy stored in Redis for server-side verification

### Authorization
- `requireAuth`
- `requireAdmin`
- `requireCustomer`

### Headers
Helmet is used with:
- content security policy
- frameguard
- HSTS in production
- referrer policy

### Rate Limiting
Arcjet is used for:
- global traffic limiting
- signup limiting
- login limiting
- checkout limiting
- search limiting

### File Upload Safety
Multer uses:
- memory storage
- 5 MB file size limit
- image-only MIME filtering

### Error Handling
Errors are normalized through:
- custom application error types
- `asyncHandler`
- centralized `errorHandler`
- `notFoundHandler`

### Checkout Safety
The checkout success flow uses a Redis lock key to reduce duplicate order processing when the client retries or reloads.

## Zod Validation
Request validation is centralized inside `server/src/middlewares/security.middleware.ts` using `zod-express-middleware`.

Current validated payloads include:
- signup
- login
- create product
- product ID params
- product search query
- checkout body
- checkout success body
- cart add body
- cart quantity update body
- coupon validation body

Examples of enforced rules:
- valid emails
- minimum password length
- uppercase letter and number in passwords
- positive numeric price limits
- quantity bounds
- coupon code format
- product search query length

This keeps invalid requests out of controllers and makes the API contract more explicit.

## RAG
This repository includes an AI chat page on the frontend, but the actual RAG backend is not implemented inside this repo's Express server.

What exists here:
- `client/src/pages/AIChatPage.tsx` sends requests to a separate RAG service URL.

So if you want the Retrieval-Augmented Generation code and documentation, use this repository:

`https://github.com/AhmedAyman77/RAG-Assistant`

## Notes
- The frontend Axios client uses `http://localhost:5000/api` during development.
- OAuth users are linked either by provider ID or by existing email if the same account already exists.
- Product search is powered by Elasticsearch, not SQL `LIKE` queries.
- Featured products are cached in Redis under `featured_products`.
- Refresh tokens are stored in Redis under keys like `refresh_token:<userId>`.
- Product images are uploaded to Cloudinary and stored by URL in the database.
- The server prints the Swagger URL on startup.

For the relational schema diagram, see `server/ERD.md`.
