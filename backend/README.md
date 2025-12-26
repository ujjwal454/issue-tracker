# Complaint Tracking System - Backend

NestJS backend with TypeScript, PostgreSQL, Prisma, and JWT authentication (without Passport).

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/complaints
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
PORT=3000
```

### 3. Database Setup

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Run the Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Users (Admin Only)

- `POST /users` - Create a resolver (Admin only)
- `GET /users` - Get all users (Admin only)
- `GET /users/resolvers` - Get all resolvers (Admin only)
- `DELETE /users/:id` - Delete a user (Admin only)

### Complaints

- `POST /complaints` - Create a complaint (User only)
- `GET /complaints` - Get complaints (filtered by role)
  - Admin: sees all complaints
  - Resolver: sees assigned complaints
  - User: sees own complaints
- `GET /complaints/my` - Get assigned complaints (Resolver only)
- `PATCH /complaints/:id/assign` - Assign resolver to complaint (Admin only)
- `PATCH /complaints/:id/status` - Update complaint status (Resolver only)

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Roles

- **ADMIN**: Can manage users and assign complaints
- **RESOLVER**: Can view and update assigned complaints
- **USER**: Can create and view own complaints

## Database Schema

- **User**: id, name, email, password, role
- **Complaint**: id, title, description, status, userId, resolverId

## Status Values

- `PENDING` - Complaint is pending assignment
- `IN_PROGRESS` - Complaint is being worked on
- `RECHECK` - Complaint needs recheck
- `DONE` - Complaint is completed
