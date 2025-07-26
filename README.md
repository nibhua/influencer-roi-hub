# HealthKart Influencer ROI Dashboard

An **open-source dashboard** that lets HealthKart track the full ROI of its influencer campaigns across Instagram, YouTube, Twitter, and more. It provides complete visibility into campaign performance, incremental ROAS, influencer insights, and payout liabilities—all from a single interface.

---

## 1. Project Structure
/healthkart-roi-dashboard
│
├─ data/ # Simulated CSVs for quick demo
│ ├─ influencers.csv
│ ├─ posts.csv
│ ├─ tracking_data.csv
│ └─ payouts.csv
│
├─ src/
│ ├─ components/ # Reusable UI modules
│ ├─ hooks/ # Custom React hooks
│ ├─ lib/
│ │ └─ gemini.ts # Minimal wrapper for Gemini API
│ ├─ pages/
│ │ ├─ Index.tsx # Dashboard home (Overview)
│ │ ├─ Influencers.tsx
│ │ ├─ Campaigns.tsx
│ │ └─ Insights.tsx
│ └─ styles/
│
├─ public/ # Logos, icons
│
├─ .env.example # Place API keys here
├─ README.md # (you’re here)
└─ package.json

---

## 2. Key Assumptions

1. **Incremental ROAS** uses a lift-based approach:  

   `incremental revenue = observed revenue − expected baseline`  
   `incremental ROAS   = incremental revenue ÷ spend`

2. **Payout basis**

   * `basis="post"`  → `total_payout = rate × number_of_posts`  
   * `basis="order"` → `total_payout = rate × orders_attributed`

3. Simulated data represents one fiscal quarter and is loaded via CSV for the live demo; in production you can replace it with warehouse or API connectors.

4. Google Gemini is used solely for explanatory text (insights, trend narratives). All metric calculations run locally to avoid hallucination risk.

---

## 3. Setup & Run

### 3.1 Clone the repo

git clone https://github.com/your-handle/healthkart-roi-dashboard.git
cd healthkart-roi-dashboard

### 3.2 Install dependencies

pnpm install # or npm / yarn

### 3.3 Environment variables

Create a `.env` file:

VITE_GEMINI_API_KEY=your_key_here

### 3.4 Start dev server

pnpm dev

The dashboard will be running at **http://localhost:5173**.

---

## 4. Core Features

| Area          | What it does                                                                        | Where to find                 |
|---------------|-------------------------------------------------------------------------------------|-------------------------------|
| **Data Upload** | CSV drag-and-drop or manual entry with schema validation                           | “Upload Data” button (header) |
| **Overview**    | Tiles for spend, revenue, incremental ROAS; time-series charts                    | `/`                           |
| **Influencers** | Sortable table of reach, orders, ROAS; drill-downs                                | `/influencers`                |
| **Campaigns**   | Campaign filter, paid vs incremental performance, payout tracker                  | `/campaigns`                  |
| **Insights (AI)**| Gemini-generated narratives: top performers, risky spends, persona match         | `/insights`                   |
| **Export**      | One-click CSV for any table; PDF snapshot of the current view                     | “Export” menu                 |

---

## 5. How the AI Integration Works

1. **Generate prompt** – When you hit **“Generate Report”**, the app gathers the current filter context (brand, platform, period).  
2. **Call Gemini** – `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` with a structured prompt embedding the KPIs.  
3. **Render** – Gemini’s response is displayed in the Insights panel and cached for the session.

Example API payload (key redacted):

{
"contents": [
{
"parts": [
{
"text": "Summarize campaign performance: spend 1.2M, revenue 4.8M, incremental ROAS 2.4x ..."
}
]
}
]
}

---

## 6. Extending for Production

* Swap simulated CSVs with a Supabase Postgres instance (helper in `lib/db.ts` provided).
* Schedule nightly refresh jobs (GitHub Actions) to recompute incremental baselines.
* Add authentication (e.g., Supabase Auth) to restrict dashboards per marketing team.

---

## 7. Quick-Start Demo

pnpm demo # seeds fresh data & opens the browser

---

## 8. Contribution Guidelines

1. Fork → create feature branch → submit Pull Request.  
2. Lint and type-check must pass (`pnpm lint`, `pnpm typecheck`).  
3. Keep UI consistent with the existing teal/blue design system.

---

## 9. License

MIT – free for commercial and non-commercial use.

Enjoy building **better influencer analytics** with HealthKart!

