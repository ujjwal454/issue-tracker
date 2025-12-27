# Deployment Guide for Render

## Configuration Summary

The backend is configured to automatically work with Render and similar platforms:

### Key Configuration Files

1. **package.json**:
   - `postinstall`: Runs `prisma generate` after `npm install` (ensures Prisma client is generated)
   - `build`: Runs `prisma generate && nest build` (generates client and builds the app)
   - `start:prod`: Runs `node dist/main` (production start command)

2. **prisma/schema.prisma**:
   - Output path configured: `../node_modules/.prisma/client`
   - Database connection via `DATABASE_URL` environment variable

3. **Environment Variables Required**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens (optional, defaults to 'supersecretkey')
   - `JWT_EXPIRES_IN`: Token expiration (optional, defaults to '7d')
   - `PORT`: Server port (optional, defaults to 3000)

## Render Deployment Steps

1. **Create a PostgreSQL Database on Render**:
   - Go to Dashboard → New → PostgreSQL
   - Copy the Internal Database URL

2. **Create a Web Service**:
   - Go to Dashboard → New → Web Service
   - Connect your Git repository
   - Configure:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start:prod`
     - **Environment Variables**:
       - `DATABASE_URL`: Your PostgreSQL Internal Database URL
       - `JWT_SECRET`: (Generate a secure random string)
       - `JWT_EXPIRES_IN`: `7d`
       - `PORT`: `10000` (Render's default, or use `$PORT`)

3. **Deploy**:
   - Click "Create Web Service"
   - Render will:
     1. Run `npm install` (which triggers `postinstall` → `prisma generate`)
     2. Run `npm run build` (which runs `prisma generate && nest build`)
     3. Run `npm run start:prod` to start the server

## How It Works

- **postinstall script**: Automatically generates Prisma client after `npm install`
- **build script**: Ensures Prisma client is generated before building TypeScript
- **Prisma generates automatically**: No manual intervention needed

The Prisma client will be generated automatically during the build process, so you don't need to manually run any Prisma commands.

