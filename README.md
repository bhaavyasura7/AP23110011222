# Campus Notification System

A full-stack campus notification platform that fetches, prioritizes, and displays campus notifications across a responsive React frontend — powered by a Node.js backend with a custom logging middleware.

---

## What This Project Does

Campus life generates a lot of noise — placement drives, exam results, events. This system cuts through it by intelligently ranking notifications so that the most important ones always surface first.

- **All Notifications** — See every notification from the campus API in one place. Filter by type: Event, Result, or Placement.
- **Priority Inbox** — A smart inbox that automatically sorts and shows the top 10 most critical notifications based on a weighted priority algorithm.

---

## Project Structure

```
onlinetest/
├── logging middleware/
│   └── logger.ts              # Reusable logging utility (posts to evaluation API)
│
├── notification_app_be/
│   ├── index.ts               # Stage 1: Priority logic script (Node.js)
│   ├── server.ts              # Express proxy server (solves browser CORS)
│   ├── package.json
│   └── tsconfig.json
│
├── notification_app_fe/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Floating island-style navigation bar
│   │   │   ├── HeroSection.tsx    # Parallax scrolling hero section
│   │   │   ├── NotificationCard.tsx # Rectangular, warm-style notification cards
│   │   │   └── FilterBar.tsx      # Type filter buttons (All / Event / Result / Placement)
│   │   ├── pages/
│   │   │   ├── Home.tsx           # All Notifications feed
│   │   │   └── PriorityInbox.tsx  # Top 10 Priority Inbox
│   │   ├── types.ts               # Shared TypeScript interfaces
│   │   └── App.tsx                # React Router setup
│   └── ...
│
└── notification_system_design.md  # Algorithm design documentation
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Vanilla CSS (warm custom theme) |
| Animations | Framer Motion |
| Icons | Heroicons |
| Backend | Node.js, TypeScript, ts-node |
| Proxy Server | Express.js |
| HTTP Client | Axios |
| Logging | Custom middleware → Evaluation Log API |

---

## How to Run

### Step 1 — Start the Backend Proxy (Port 5000)

The proxy server handles the Bearer token and bypasses browser CORS restrictions.

```bash
cd notification_app_be
npm install
npm start
```

You should see:
```
[INFO] [backend/service] [Server] Backend proxy server listening on http://localhost:5000
```

### Step 2 — Start the Frontend (Port 3000)

```bash
cd notification_app_fe
npm install
npm run dev
```

Then open your browser and visit: **http://localhost:3000**

---

## How the Priority Algorithm Works

Each notification is assigned a weight based on its type:

| Type | Weight | Reason |
|---|---|---|
| Placement | 3 | Career-critical, highest urgency |
| Result | 2 | Academic importance |
| Event | 1 | Informational |

Notifications are sorted by weight first. If two notifications share the same weight, the more recent one (by `Timestamp`) comes first. The top 10 are then displayed in the Priority Inbox.

**Time Complexity:** O(N log N) — standard sort  
**Space Complexity:** O(N) — sorted copy of the list

---

## Logging Middleware

Every significant action in the app is logged using the custom `Logger` utility in `logging middleware/logger.ts`.

Each log call sends a POST request to the evaluation log server:

```
POST http://20.207.122.201/evaluation-service/logs
```

With a structured payload like:

```json
{
  "stack": "backend",
  "level": "info",
  "package": "service",
  "message": "[fetchNotifications] Successfully fetched 10 notifications."
}
```

The logger never crashes the application — all remote log failures are silently caught.

---

## API Details

### Notifications API

```
GET http://20.207.122.201/evaluation-service/notifications?limit=10
Authorization: Bearer <token>
```

The frontend does **not** call this directly. Instead it calls the local proxy:

```
GET http://localhost:5000/api/notifications?limit=10
```

The proxy then forwards the request with the correct Bearer token, avoiding browser CORS issues.

---

## Design Decisions

- **No glassmorphism** — The UI uses solid, warm-toned rectangular cards as required.
- **Island Navbar** — A floating, centered navigation bar with Framer Motion entrance animations.
- **Parallax Hero** — The landing section uses scroll-based parallax via Framer Motion's `useScroll`.
- **Vanilla CSS** — All styling written in plain CSS using CSS custom properties (no framework).
- **Fallback data** — If the proxy or live API is unreachable, the app gracefully falls back to a cached snapshot of real API data (no crash, no blank screen).
