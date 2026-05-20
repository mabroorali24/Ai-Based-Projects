# Study Assistant

An AI study assistant powered by GPT-4o with a clean, minimal interface.

## Features
- **Chat Tutor** — Conversational AI tutor for any subject
- **Flashcards** — Generate Q&A flashcards from any topic
- **Quiz Mode** — Multiple-choice quizzes with explanations
- **Notes Summarizer** — Paste notes, get a structured summary

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Then open `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-...your-key-here...
```

### 3. Run the server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

### 4. Open in browser
Navigate to: **http://localhost:3000**

---

## Project Structure
```
study-assistant/
├── server.js              # Express server entry point
├── routes/
│   ├── chat.js            # Chat tutor endpoint
│   ├── flashcards.js      # Flashcard generator endpoint
│   ├── quiz.js            # Quiz generator endpoint
│   └── summary.js         # Notes summarizer endpoint
├── public/
│   └── index.html         # Frontend (HTML + CSS + JS)
├── .env.example           # Environment variable template
└── package.json
```

## API Endpoints

| Method | Route | Body | Description |
|--------|-------|------|-------------|
| POST | `/api/chat` | `{ messages, subject? }` | Chat tutor response |
| POST | `/api/flashcards` | `{ topic, count? }` | Generate flashcards |
| POST | `/api/quiz` | `{ topic, count? }` | Generate quiz questions |
| POST | `/api/summary` | `{ text }` | Summarize notes |

## Requirements
- Node.js 18+
- An OpenAI API key (get one at https://platform.openai.com)
