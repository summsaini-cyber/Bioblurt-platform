# BioBlurt

Active Recall + Spec Tracker for AQA A-Level Biology. Built with Next.js 14 + Supabase.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Go to your Supabase project
   - Open the SQL Editor
   - Copy-paste the contents of `supabase-schema.sql`
   - Run it

3. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deploy

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Features

- 🔐 Auth (email/password)
- 🧠 Blurt mode with keyword scoring
- 📊 Dashboard with progress stats
- 📋 Full spec tracker with RAG buttons
- 🔍 Search spec points
- 📈 Score history per subtopic
- 🎯 Recommended review (weak topics)
