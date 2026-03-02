# ATM Studio — AI Video Shorts Analyzer

A full-stack SaaS platform for analyzing viral short-form videos using Google Gemini AI. Named after the "Amati, Tiru, Modifikasi" (Observe, Imitate, Modify) method.

## Architecture

- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS) — port 5000
- **Backend**: Express.js + TypeScript + Prisma ORM — port 3001
- **Database**: PostgreSQL (Replit built-in)
- **AI**: Google Gemini API (`@google/generative-ai`)

## Project Structure

```
/
├── frontend/          # Next.js app
│   ├── src/app/
│   │   ├── (dashboard)/   # Dashboard routes (ATM analyzer, prompt gen)
│   │   ├── components/    # Shared components (Navbar, Sidebar, ThemeProvider)
│   │   ├── layout.tsx
│   │   └── page.tsx       # Landing page
│   ├── next.config.ts     # Next.js config (allowedDevOrigins for Replit proxy)
│   └── package.json       # dev script uses -p 5000 -H 0.0.0.0
├── backend/           # Express API
│   ├── src/
│   │   ├── index.ts       # Express server entry (port 3001)
│   │   ├── routes/        # analyze.ts, promptGen.ts
│   │   ├── services/      # gemini.ts (AI integration)
│   │   ├── middleware/     # upload.ts (multer, 50MB limit)
│   │   └── lib/           # prisma.ts (Prisma singleton)
│   └── prisma/
│       └── schema.prisma  # VideoAnalysis, PromptGenHistory models
```

## Environment Variables

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Replit) |
| `GEMINI_API_KEY` | Google Gemini API key (required for AI features) |
| `FRONTEND_URL` | Frontend origin for CORS (set to http://localhost:5000) |

## Key Features

- **ATM Analyzer**: Upload short-form video → Gemini AI analyzes hook, structure, visuals, audio, CTA, engagement
- **Prompt Generator**: Upload image/video → generate content creation prompts in Indonesian or English
- **History**: All analyses and prompt generations are saved to PostgreSQL via Prisma
- Dark/light theme toggle

## Pages / Routes

| Route | Description |
|-------|-------------|
| `/` | ATM Studio main landing page (ATM Video micro-SaaS) |
| `/promptgen` | Prompt Gen separate landing page (Prompt Gen micro-SaaS) |
| `/atm` | ATM Video Analyzer dashboard tool |
| `/prompt-gen` | Prompt Generator dashboard tool |

### Micro-SaaS Landing Pages
Each feature has its own standalone landing page designed for subdomain deployment:
- **ATM Video** → `page.tsx` at `/` → brand: ATMSTUDIO
- **Prompt Gen** → `promptgen/page.tsx` at `/promptgen` → brand: PROMPTSTUDIO

Both landing pages share the same design system (CSS variables, Inter font, identical component patterns) but with feature-specific copy, hero visuals, and CTA flows.

## Workflows

- **Start application**: `cd frontend && npm run dev` (port 5000, webview)
- **Backend API**: `cd backend && npm run dev` (port 3001, console)

## Notes

- Backend uses `ts-node` + `nodemon` for hot reload in dev
- Frontend API calls use `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:3001/api`)
- File uploads are temporary — deleted after AI analysis
- Prisma schema pushed with `cd backend && npx prisma db push`
