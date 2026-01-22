# Govindam Food Court Builder

This project is a full-stack web application designed for managing food courts, including a robust admin panel, dynamic menu management, and user ordering system. It uses a **client-server** architecture.

## Project Structure

- **client/**: The frontend application built with React, Vite, TailwindCSS, and Shadcn UI.
- **server/**: The backend API built with Node.js, Express, and Prisma (PostgreSQL).
- **db/**: Database configuration files (Supabase).
- **package.json**: Root configuration to manage both workspaces.

## Prerequisites

Before setting up the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [Supabase](https://supabase.com/) account (for the PostgreSQL database).

---

## Setup Guide (Start to End)

Follow these steps to set up the project on your local machine.

### 1. Clone & Install Dependencies
First, clone the repository and install all dependencies for the root, client, and server.

```bash
# Install dependencies for root, client, and server
npm run install:all
```

### 2. Database Setup (Supabase)
1.  **Create a Project**: Log in to Supabase and create a new project.
2.  **Get Credentials**: Go to `Project Settings` -> `API`. You will need:
    -   `Project URL`
    -   `anon` (public) key
3.  **Get Connection String**: Go to `Project Settings` -> `Database` -> `Connection Pooling` (recommended) or `Direct Connection`. Copy the connection string.

### 3. Environment Configuration

You need to configure environment variables for both the **Client** and **Server**.

#### Server Configuration (`server/.env`)
Create a new file named `.env` inside the `server/` folder and add the following:

```env
PORT=5002
# Replace [PASSWORD] with your actual Supabase DB password
DATABASE_URL="postgresql://postgres:[PASSWORD]@your-project.supabase.co:5432/postgres"

# These are used for specific backend integrations if needed
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
VITE_SUPABASE_URL="your_supabase_url"
```

#### Client Configuration (`client/.env`)
Create a new file named `.env` inside the `client/` folder and add the following:

```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
VITE_SUPABASE_URL="your_supabase_url"

# API URL (Optional, defaults to http://localhost:5002/api)
VITE_API_URL="http://localhost:5002/api"
```

### 4. Database Schema & Seeding
Once the setup is done, you need to sync the database schema using Prisma.

```bash
cd server

# Push the Prisma schema to your Supabase database
npm run prisma:push

# (Optional) Seed the database with initial data
npm run seed

cd ..
```

### 5. Running the Application
You can run both the client and server concurrently from the root directory.

```bash
# Starts Client (localhost:5000) and Server (localhost:5002)
npm run dev
```

-   **Frontend**: Open [http://localhost:5000](http://localhost:5000)
-   **Backend**: API runs at [http://localhost:5002](http://localhost:5002)

### 6. Building for Production
To build both the frontend and backend for production:

```bash
npm run build
```
This command runs the build scripts for both workspaces.

---

## Workspace Commands
The root `package.json` includes helper scripts:
- `npm run dev`: Runs both client and server in dev mode.
- `npm run install:all`: Installs all dependencies.
- `npm run dev:client`: Runs only the client.
- `npm run dev:server`: Runs only the server.
- `npm run build`: Builds both projects.
