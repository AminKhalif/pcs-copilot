# PCS Copilot

PCS Copilot is a TurboTax-style copilot for military PCS moves. It helps service members parse orders, calculate travel entitlements, and automate the DTS voucher flow through a live browser agent.

## Team

- Teammates: Amin Khalif
- Track: Gen A.I Mill

## What We Built

PCS Copilot is a guided filing experience for military moves. The app takes PCS orders, extracts the structured details needed for a claim, calculates allowances, and uses a browser agent to walk through the DTS voucher workflow.

## Tech Used

- Next.js 16
- React 19
- TypeScript
- Python
- NVIDIA APIs
- Gemini API
- Browser Use
- Playwright

## How It Works

1. Paste or upload PCS orders into the app.
2. The orders parser uses NVIDIA APIs to extract service-member and travel details.
3. The app calculates entitlements such as DLA, per diem, MALT, and TLE.
4. The browser agent uses Browser Use with NVIDIA-backed reasoning and Gemini-based safety checks to fill the DTS flow.
5. A fallback Playwright path is available if the primary browser agent path fails.

## Running The Project

### Prerequisites

- Node.js 20+
- pnpm
- Python 3.12

### Environment Variables

Create or update `.env.local` in the project root with:

```bash
NVIDIA_API_KEY=your_nvidia_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### Install Frontend Dependencies

```bash
pnpm install
```

### Install Agent Dependencies

```bash
cd agent
python3.12 -m venv .venv312
. .venv312/bin/activate
pip install -r requirements.txt
playwright install chromium
cd ..
```

### Start The App

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Repository Notes

The browser agent lives in `agent/agent.py` and the Next.js app runs from the project root. The API routes that connect the UI to the parser and agent are under `app/api`.
