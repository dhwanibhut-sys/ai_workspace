# Deployment Guide - AI Workspace

This guide explains how to deploy the AI Workspace (Backend and Frontend) to production environments like Railway and Vercel.

## Backend Deployment (Railway)

The backend is built with NestJS and uses Prisma with PostgreSQL.

1.  **Repository**: Link your GitHub repository to a new Railway project.
2.  **Environment Variables**:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `PORT`: Set to `3001` (Railway will automatically assign this).
    *   `JWT_SECRET`: A long random string for auth (if applicable).
3.  **Build Command**: `npm run build`
4.  **Start Command**: `npm run start:prod`
5.  **Prisma**: Ensure `npx prisma db push` or `npx prisma migrate deploy` is run during or after deployment.

## Frontend Deployment (Vercel)

The frontend is built with Next.js.

1.  **Repository**: Link your GitHub repository to a new project in Vercel.
2.  **Root Directory**: Set this to `ai-workspace-frontend`.
3.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: The public URL of your deployed backend (e.g., `https://your-backend.up.railway.app`).
4.  **Build Command**: `next build`
5.  **Output Directory**: `.next`

## Local Development (Non-Docker)

1.  Copy `.env.example` to `.env` in `ai-workspace-backend`.
2.  Copy `.env.local.example` to `.env.local` in `ai-workspace-frontend`.
3.  Run `npm install:all` from the root.
4.  Run `npm run dev` from the root.
