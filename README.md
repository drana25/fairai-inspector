# FairAI Inspector

> Detect bias in AI datasets before they harm real people.

## UN SDG Alignment
- **SDG 10 — Reduced Inequalities** (Target 10.3: Eliminate discriminatory 
  laws, policies and practices)
- **SDG 16 — Peace, Justice & Strong Institutions** (Target 16.6: 
  Accountable and inclusive institutions)

Automated systems increasingly make hiring, lending, and healthcare 
decisions. When trained on biased historical data, these systems 
replicate discrimination at scale. FairAI Inspector detects this 
bias in seconds — free, private, and explainable.

## Live Demo
[FairAI Inspector — Live Demo](https://fair-ai-detection.web.app/)
Click "Try Demo" — no account required.

## How It Works
1. Upload or paste a CSV dataset
2. AI analyses demographic fairness across protected columns
3. Get a plain-English bias report with charts and verdicts

## What It Detects
- Disparate Impact Ratio (DIR) per demographic group
- Statistical Parity Difference (SPD)
- PASS / WARNING / FAIL verdicts per column
- Overall Fairness Score (0–100)

## Google Technologies Used
- Firebase Authentication (Google Sign-In)
- Firebase Firestore
- Firebase Hosting
- Gemini AI (explanation generation)

## Tech Stack
- React + Vite + Tailwind CSS
- Recharts (visualisations)
- PapaParse (CSV parsing)
- Framer Motion (animations)

## Setup
```bash
git clone https://github.com/drana25/fairai-inspector.git
cd fairai-inspector
npm install
cp .env.example .env.local
# Add your Firebase + Gemini keys to .env.local
npm run dev
```

## Technical Challenge We Solved
Gemini API free tier quota gets exhausted during heavy testing. We solved 
this by implementing a local explanation engine that generates plain-English 
bias explanations directly from statistical results in the browser — so the 
app always works even without an API connection.

## Team PIXEL
GDG Solution Challenge 2026 — Build with AI

