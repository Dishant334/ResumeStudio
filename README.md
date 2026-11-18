# ResumeStudio

ATS-friendly resume builder for engineering students: 9 templates, AI summary/bullet polish, PDF import, public share links.

**Stack:** React 19 + Vite + Tailwind 4 + motion · Express 5 + MongoDB · ImageKit · Gemini (OpenAI-compatible API)

## Run
```bash
cd server-backend && cp .env.example .env && npm install && npm run server   # :3000
cd client-frontend && cp .env.example .env && npm install && npm run dev      # :5173
```

## Environment (server-backend/.env)
| Var | Notes |
|---|---|
| `MONGO_URI` | Atlas/local URI. Empty = embedded dev DB persisted in `.mongo-data/` |
| `JWT_SECRET` | long random string (required) |
| `OPENAI_API_KEY` | Gemini key from https://aistudio.google.com/apikey (AI features) |
| `OPENAI_BASE_URL` / `OPENAI_MODEL` | defaults to Gemini's OpenAI-compatible endpoint / `gemini-2.5-flash` |
| `IMAGEKIT_PRIVATE_KEY` | optional, profile photo + background removal |
| `CLIENT_URL` | optional CORS allow-list |

Never commit `.env` files.
