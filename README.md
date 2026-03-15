# B&M Training LMS – Module 2

A React-based training module for B&M law firm staff, built with Vite and Tailwind CSS.

## Overview

This app delivers interactive legal training content (Module 2). When a learner completes the module, completion data is posted to a Power Automate endpoint for tracking and reporting.

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```
VITE_POWERAUTOMATE_URL=  # Power Automate HTTP trigger URL for completion webhook
```

The `VITE_` prefix exposes the variable to client-side code via `import.meta.env`.

## Project Structure

```
src/
  main.jsx          # Vite entry point
  App.jsx           # Main app shell
  data/             # Static data (glossary, cards, etc.) — added after JSX split
  components/       # UI components — added after JSX split
public/             # Static assets
index.html          # HTML shell (Tailwind loaded via CDN script tag)
```

## Notes

- Tailwind CSS is loaded via CDN `<script>` tag in `index.html` — no PostCSS build step required.
- Completion data posts to the Power Automate endpoint defined in `.env`.
