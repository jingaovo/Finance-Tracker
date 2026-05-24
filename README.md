# Finance Tracker

A full-stack personal finance application for tracking income and expenses, visualizing spending patterns, and managing transactions from a clean dashboard.

## Features

- **User authentication** — Register and sign in with JWT-based sessions
- **Transaction management** — Add income and expense records with category, date, and description
- **Financial overview** — Summary cards for total income, expenses, and net balance
- **Analytics** — Pie, bar, and line charts for income vs expenses, category breakdown, and monthly trends
- **Search & filter** — Find transactions by description or category
- **Responsive UI** — Modern interface built with React and Tailwind CSS

## Tech Stack

| Layer      | Technologies |
| ---------- | ------------ |
| Frontend   | React 18, React Router, Tailwind CSS, Chart.js, Create React App |
| Backend    | Node.js, Express, MongoDB, Mongoose |
| Auth       | JSON Web Tokens (JWT), bcryptjs |

## Project Structure

```
Finance-Tracker/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # User & Transaction schemas
│   ├── routes/          # API routes
│   ├── utility/         # Token generation
│   └── server.js        # Express entry point (port 5001)
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Header, charts, table, modal, summary
│       └── pages/       # Landing page, Dashboard
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- npm (included with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Finance-Tracker
```

### 2. Backend setup

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/finance-tracker
JWT_SECRET=your_super_secret_jwt_key_here
```

| Variable     | Description |
| ------------ | ----------- |
| `MONGO_URI`  | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret key used to sign JWT tokens — use a long random string in production |

**MongoDB Atlas example:**

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

Start the API server:

```bash
npm run dev
```

The backend runs at **http://localhost:5001**. You should see `MongoDB Connected` and `Server is running` in the terminal.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000**.

### 4. Use the app

1. Open **http://localhost:3000** and create an account (Register tab).
2. Sign in with your email and password.
3. You are redirected to the **Dashboard**, where you can add transactions and view charts.

> **Note:** Registration does not return a JWT. After signing up, use **Sign in** to access the dashboard.

## Running in Development

Run both servers in separate terminals:

| Service  | Directory  | Command        | URL |
| -------- | ---------- | -------------- | --- |
| Backend  | `backend/` | `npm run dev`  | http://localhost:5001 |
| Frontend | `frontend/`| `npm start`    | http://localhost:3000 |

The frontend expects the API at `http://localhost:5001`. If you change the backend port, update the `fetch` URLs in the frontend source files accordingly.

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| `POST` | `/api/auth/register` | No | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT (`email`, `password`) |

**Login response example:**

```json
{
  "message": "Login successful",
  "user": { "id": "...", "name": "Jane", "email": "jane@example.com" },
  "token": "<jwt>"
}
```

### Transactions

All transaction routes require a Bearer token:

```
Authorization: Bearer <token>
```

| Method   | Endpoint | Description |
| -------- | -------- | ----------- |
| `GET`    | `/api/transactions` | List all transactions for the logged-in user |
| `POST`   | `/api/transactions` | Create a transaction |
| `PUT`    | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

**Transaction body:**

```json
{
  "amount": 49.99,
  "category": "Groceries",
  "date": "2026-05-24",
  "description": "Weekly shop",
  "type": "expense"
}
```

`type` must be `"income"` or `"expense"`.

### Health check

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/` | API home / status |

## Frontend Routes

| Path | Page | Access |
| ---- | ---- | ------ |
| `/` | Landing (sign in / register) | Public |
| `/dashboard` | Dashboard | Requires login (JWT in `localStorage`) |

## Scripts

### Backend (`backend/`)

| Command | Description |
| ------- | ----------- |
| `npm start` | Start server with Node |
| `npm run dev` | Start server with Nodemon (auto-reload) |

### Frontend (`frontend/`)

| Command | Description |
| ------- | ----------- |
| `npm start` | Start development server |
| `npm run build` | Production build to `frontend/build` |
| `npm test` | Run tests (Create React App) |

## Environment & Security Notes

- Never commit `.env` files or secrets to version control.
- Use a strong, unique `JWT_SECRET` in production.
- Tokens expire after **12 hours** (configured in `backend/utility/generateToken.js`).
- For production, configure CORS, HTTPS, and environment-specific API URLs on the frontend.

## Troubleshooting

| Issue | Possible fix |
| ----- | ------------- |
| Backend exits on startup | Check `MONGO_URI` and that MongoDB is running |
| `Failed to fetch transactions` | Ensure backend is running on port 5001 and you are logged in |
| Login works but dashboard shows errors | Clear `localStorage` and sign in again to refresh the token |
| Frontend styles missing | Run `npm install` in `frontend/` and restart `npm start` |

