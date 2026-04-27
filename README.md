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

## Demo Video
[Watch 3-minute demo](YOUR_YOUTUBE_URL_HERE)

## Problem Statement
Automated AI systems increasingly make decisions about hiring, 
lending, and healthcare. When trained on biased historical data, 
these systems replicate discrimination at scale. A single biased 
hiring model can affect thousands of candidates. Manual bias audits 
require data science expertise and take 4-8 hours. Most organisations 
have never audited their AI tools for fairness.

## Our Solution
FairAI Inspector lets any HR manager, data scientist, or compliance 
officer upload a CSV dataset and receive a full fairness audit in 
under 15 seconds — with plain-English explanations powered by 
Google Gemini.

## Impact
- Targets: UN SDG 10 (Target 10.3) and SDG 16 (Target 16.6)
- Detects bias using the Disparate Impact Ratio — the same legal 
  standard used by the US EEOC (Equal Employment Opportunity Commission)
- 100% private: raw data processed in-browser, never sent to servers
- Zero setup: works in any browser, no installation needed

## Technical Challenge We Solved
Gemini API free tier quota gets exhausted during heavy testing. 
We solved this by implementing a local explanation engine that 
generates plain-English bias explanations directly from statistical 
results in the browser — so the app always works regardless of 
API availability.

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

