# EventIQ — AI Event Concierge Platform

A production-ready full-stack application that uses AI to generate venue proposals for corporate events based on natural language descriptions.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind CSS    |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB + Mongoose                      |
| AI        | Google Gemini  (FREE)          |


---

## Project Structure

```
ai-event-concierge/
├── frontend/          # Next.js 14 app
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/
│   │   ├── lib/       # API client, utils
│   │   └── types/
│   └── package.json
│
├── backend/           # Express.js API
│   ├── src/
│   │   ├── config/    # DB connection
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/    # Mongoose schemas
│   │   ├── routes/
│   │   └── utils/     # OpenAI service
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- gemini API key

---

## Local Development

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your keys
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-event-concierge
GEMINI_API_KEY=your-gemini-api-key-here
FRONTEND_URL=http://localhost:3000
```


### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## API Endpoints

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| POST   | /api/events/search     | Generate AI venue proposal     |
| GET    | /api/events/history    | Get paginated search history   |
| GET    | /api/events/stats      | Get usage statistics           |
| GET    | /api/events/:id        | Get single event search        |
| DELETE | /api/events/:id        | Delete an event search         |
| GET    | /api/health            | Health check                   |

### POST /api/events/search

**Request:**
```json
{
  "query": "A 10-person leadership retreat in the mountains for 3 days with a $4k budget"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userQuery": "...",
    "parsedIntent": {
      "attendees": "10 people",
      "duration": "3 days",
      "budget": "$4,000",
      "eventType": "leadership retreat",
      "preferences": ["mountains"]
    },
    "proposal": {
      "venueName": "The Lodge at Breckenridge",
      "location": "Breckenridge, CO",
      "estimatedCost": "$3,200 - $3,800 total",
      "whyItFits": "...",
      "capacity": "Up to 15 guests",
      "amenities": ["Meeting rooms", "Mountain views", "Catering", "WiFi"],
      "venueType": "Mountain Lodge"
    },
    "alternativeVenues": [...]
  }
}
```

---



## Features

- **AI-powered proposals** — Gemini 1.5 Flash (FREE) generates structured venue recommendations
- **Persistent history** — All searches saved to MongoDB, survive page refreshes
- **Paginated history** — Browse all past searches with pagination
- **Alternative venues** — 2 backup options for every proposal
- **Rate limiting** — Prevents API abuse (10 AI requests/minute, 100 global/15min)
- **Input validation** — Server-side validation on all endpoints
- **Error handling** — Centralized error middleware with proper HTTP codes
- **Loading states** — Animated step-by-step loading UI
- **Delete searches** — Remove individual entries from history
- **Usage stats** — Total searches and today's count in the navbar
