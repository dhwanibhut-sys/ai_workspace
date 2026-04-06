# AI Workspace

A modern, context-first AI document editor and workspace built with **NestJS**, **Prisma**, and **Next.js**.

## 🚀 Quick Start (Local Development)

The project is optimized for ease of use. You can run both the frontend and backend with a single command from the root directory.

### Prerequisites
- Node.js (v20+)
- PostgreSQL (or Supabase)
- OpenAI/Groq API Key

### Setup & Run
1.  **Install all dependencies**:
    ```bash
    npm run install:all
    ```
2.  **Configure `.env` files**:
    - Ensure `ai-workspace-backend/.env` has your `DATABASE_URL` and `OPENAI_API_KEY`.
    - Ensure `ai-workspace-frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3001`.
3.  **Launch the Workspace**:
    ```bash
    npm run dev
    ```
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend**: [http://localhost:3001](http://localhost:3001)

---

## 🌐 Deployment Guide (No Docker)

This workspace is designed to be "Direct Deploy ready" on modern cloud platforms.

### 1. Backend (Railway / Render / Heroku)
- **Repo**: Point the service to the `ai-workspace-backend` directory.
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`
- **Environment Variables**:
  - `DATABASE_URL`: Your production database string.
  - `PORT`: (Provided by host).
  - `OPENAI_API_KEY`: Your LLM key.

### 2. Frontend (Vercel)
- **Repo**: Point the Vercel project to the `ai-workspace-frontend` directory.
- **Framework Preset**: Next.js.
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://api.yourworkspace.com`).

---

## 📁 Project Structure
- **/ai-workspace-backend**: NestJS API with Prisma ORM.
- **/ai-workspace-frontend**: Next.js application with Tailwind CSS.
- **docker-compose.yml**: Optional orchestration for containerized environments.

## 🛠️ Key Features
- **AI Chat**: Context-aware conversations linked to your documents.
- **Doc Editor**: Real-time document editing with version history.
- **Unified Search**: Search across all your documents and chats.
- **Prisma Support**: Type-safe database interactions with PostgreSQL.
