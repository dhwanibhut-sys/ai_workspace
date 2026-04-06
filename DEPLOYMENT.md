# Deployment Guide - AI Workspace

This guide explains how to deploy the AI Workspace (Backend and Frontend) to production environments using **Vercel** for the frontend and **Render** for the backend.

## Backend Deployment (Render)

The backend is built with NestJS and uses Prisma with PostgreSQL. We use native Node.js builds (no Docker).

1.  **Create a New Web Service**: Link your GitHub repository to a new "Web Service" on Render.
2.  **Root Directory**: Set this to `ai-workspace-backend`.
3.  **Runtime**: Select `Node`.
4.  **Environment Variables**:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `OPENAI_API_KEY`: Your OpenAI API key.
    *   `PORT`: `10000` (Render default).
5.  **Build Command**: `npm install && npm run build`
6.  **Start Command**: `npm run start:prod`

## Frontend Deployment (Vercel)

The frontend is built with Next.js and connects to the Render backend.

1.  **Create Project**: Link your GitHub repository to a new project in Vercel.
2.  **Root Directory**: Set this to `ai-workspace-frontend`.
3.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: The public URL of your deployed Render backend (e.g., `https://ai-workspace-backend.onrender.com`).
4.  **Build Settings**: Use defaults (`npm run build`).

## Local Development (Native)

1.  From the root, run `npm run install:all`.
2.  Initialize environment files: `npm run setup`.
3.  Start both services: `npm run dev`.
