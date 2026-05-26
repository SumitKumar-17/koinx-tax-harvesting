# KoinX — Tax Loss Harvesting Tool

A responsive React + TypeScript application that lets users visualize and simulate tax loss harvesting across their crypto holdings.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v3** for styling
- **Vite** for bundling
- Mock APIs via in-app promises (no external server needed)

## Features

- Pre-harvesting capital gains card (dark theme) showing STCG/LTCG profits, losses, and net gains
- After-harvesting card (blue theme) that updates in real-time as holdings are selected
- "You're going to save ₹X" savings banner when tax reduction is detected
- Holdings table with:
  - Per-row checkbox selection with visual feedback
  - Select/deselect all via header checkbox
  - "View All" / "View Less" toggle (shows 5 rows by default)
  - Amount to Sell populated on selection
- Loading spinners and error states for both API calls
- Fully mobile responsive layout
- `useContext` for global state management

## Assumptions

- Gains in the holdings data represent unrealized gains; selecting a row simulates selling that holding to harvest the loss/gain.
- When a selected holding's gain is positive it is added to profits; when negative, its absolute value is added to losses.
- Currency values are displayed in INR using the `en-IN` locale.
- The 25 holdings in the API are rendered with the first 5 visible by default.
