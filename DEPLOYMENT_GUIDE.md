# 🚀 Deployment Guide: Hotal Govindam

This guide will help you deploy your website for **FREE** using **Vercel** (for the Frontend) and **Render** (for the Backend), while keeping your **Supabase** database.

## Prerequisites
- A GitHub account.
- Your code pushed to a GitHub repository.

---

## Part 1: Backend Deployment (Render)
We will deploy the `server` folder to Render.

1.  **Create an Account**: Go to [render.com](https://render.com) and sign up with GitHub.
2.  **New Web Service**:
    - Click **"New +"** -> **"Web Service"**.
    - Select "Build and deploy from a Git repository".
    - Connect your GitHub repository.
3.  **Configuration**:
    - **Name**: `govindam-server` (or similar)
    - **Region**: Choose one close to `aws-1-ap-south-1` (Singapore is usually closest to Mumbai/South Asia free tier).
    - **Branch**: `main` (or your working branch)
    - **Root Directory**: `server`
    - **Runtime**: `Node`
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
    - **Instance Type**: Select **"Free"**.
4.  **Environment Variables**:
    - Scroll down to "Environment Variables" and add these keys (copy values from your local `server/.env`):
        - `DATABASE_URL`: (Copy the long string starting with `postgresql://...` from your `server/.env`).
        - `JWT_SECRET`: (Set this to a random secret string, or copy `secret_key`).
        - `CLOUDINARY_CLOUD_NAME`: (Copy from `.env`)
        - `CLOUDINARY_API_KEY`: (Copy from `.env`)
        - `CLOUDINARY_API_SECRET`: (Copy from `.env`)
        - `PORT`: `10000` (Render sets this automatically, but you can set it to 10000 if you want).
5.  **Deploy**: Click **"Create Web Service"**.
    - Wait for the build to finish. It might take a few minutes.
    - Once "Live", copy the **Service URL** (e.g., `https://govindam-server.onrender.com`). You will need this for the Frontend.

> **Note**: The Free tier on Render "spins down" after inactivity. The first request after a while will take 30-60 seconds to load.

---

## Part 2: Frontend Deployment (Vercel)
We will deploy the `client` folder to Vercel.

1.  **Create an Account**: Go to [vercel.com](https://vercel.com) and sign up with GitHub.
2.  **Add New Project**:
    - Click **"Add New..."** -> **"Project"**.
    - Import your GitHub repository.
3.  **Configuration**:
    - **Framework Preset**: It should auto-detect **Vite**.
    - **Root Directory**: Click "Edit" and select the `client` folder.
4.  **Environment Variables**:
    - Open the "Environment Variables" section. Add these:
        - `VITE_API_URL`: Paste the **Render Service URL** you copied in Part 1 + `/api` (e.g., `https://govindam-server.onrender.com/api`).
        - `VITE_SUPABASE_URL`: (Copy from `client/.env`).
        - `VITE_SUPABASE_PUBLISHABLE_KEY`: (Copy from `client/.env`).
        - `VITE_SUPABASE_PROJECT_ID`: (Copy from `client/.env`).
5.  **Deploy**: Click **"Deploy"**.
    - Vercel will build your site.
    - Once done, you will get a **Production Domain** (e.g., `govindam-client.vercel.app`).

---

## Part 3: Final Checks
1.  **Open your Vercel URL**.
2.  Try to login/register. This tests the **Backend Connection**.
    - *If it fails*, check the Browser Console (F12) for CORS errors.
    - If you see CORS errors, you might need to set a `CLIENT_URL` variable in Render (if your backend code uses it), or update the CORS configuration in `server/src/index.ts` to allow your Vercel domain. *Currently, your code allows all origins (`*`), so it should work immediately.*
3.  Check images. If Cloudinary vars are set, images should work and persist.

## Summary of Changes Made
- Added `client/vercel.json` to handle page routing for the frontend.
- No other code changes were needed as your project is well-structured for this deployment!
