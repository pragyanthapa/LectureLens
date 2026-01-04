# Deploying to Vercel

This guide will help you deploy your LectureLens project to Vercel.

## Prerequisites

1. A GitHub account (recommended) or GitLab/Bitbucket
2. A Vercel account (sign up at https://vercel.com)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `out` (for static export)
   - **Install Command**: `npm install` (auto-detected)

5. **Important**: Add Environment Variable:
   - Go to "Environment Variables" section
   - Add: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Click "Add"

6. Click "Deploy"

### Step 3: Configure Build Settings

Since this is a static export project, Vercel should automatically:
- Build the project
- Generate static files in the `out` directory
- Deploy them

## Method 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project or create new
   - Set environment variables when prompted

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Environment Variables

Make sure to add your Gemini API key in Vercel:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add:
   - **Name**: `NEXT_PUBLIC_GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environment**: Production, Preview, Development (select all)

## Important Notes

⚠️ **Security Warning**: Since this is a static frontend app, your `NEXT_PUBLIC_GEMINI_API_KEY` will be exposed in the browser. Make sure to:

1. Restrict your API key in Google Cloud Console:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Edit your API key
   - Add HTTP referrer restrictions (your Vercel domain)
   - Set usage quotas

2. Monitor your API usage regularly

## Troubleshooting

- If build fails, check that `output: 'export'` is set in `next.config.mjs`
- Make sure all environment variables are set in Vercel
- Check build logs in Vercel dashboard for errors

## After Deployment

Your site will be available at: `https://your-project-name.vercel.app`

You can also add a custom domain in Vercel project settings.

