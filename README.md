# AI Content Detector

AI Content Detector is a small web tool for estimating how much AI-generated content may exist in an article. It supports URL extraction and direct text input, then analyzes writing patterns, structure, repeated phrases, emotional depth, and sentence-level signals.

## Features

- Analyze article content from a URL
- Analyze pasted text directly
- Show an AI-content score and writing-pattern signals
- Highlight sentences with suspicious AI-generated traits
- Export a visual analysis report

## Tech Stack

- React
- Vite
- Tailwind CSS
- Zhipu GLM API

## Setup

Create a local `.env` file based on `.env.example`:

```bash
ZHIPU_API_KEY=your_api_key_here
```

The key is read by the backend proxy API, not by the browser bundle.

Then install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## API Proxy

The frontend sends article content to `/api/analyze`. The API route calls the Zhipu GLM API on the server side, so the browser never receives `ZHIPU_API_KEY`. Deploy this project on a platform that supports serverless API routes, such as Vercel.

## Note

This project is a personal experimental tool. The analysis result should be treated as a reference signal, not a definitive judgment of authorship.
