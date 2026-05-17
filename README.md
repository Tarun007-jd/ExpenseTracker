# 💰 ExpenseTracker — Smart Finance Dashboard

> A full-stack expense tracking web application with premium fintech-grade UI, JWT authentication, interactive analytics, budget management, and dark/light mode.

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Recharts-06B6D4?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version" />
</p>

---

## ✨ Showcase

### 🎨 Premium Glassmorphism UI
Modern glass cards, smooth gradients, and polished animations create a professional fintech experience.

### 📊 Interactive Analytics Dashboard
- **Summary Stats** — Total expenses, income, balance at a glance
- **Monthly Trends** — Area charts showing spending patterns over time
- **Category Breakdown** — Pie charts visualizing where your money goes
- **Spending Insights** — Bar charts with trend analysis and comparisons

### 🔐 Secure Authentication
JWT-based signup/login with bcrypt password hashing keeps your data safe.

### 💵 Budget Management
Set category limits per month, track progress with visual bars, and get overspending alerts.

### 🌓 Dark/Light Mode
Toggle between themes with automatic system preference detection.

### 📱 Fully Responsive
Sidebar navigation that seamlessly collapses to a drawer on mobile devices.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based signup/login with bcrypt password hashing |
| 💸 **Expense Management** | Full CRUD with categories, date tracking, and descriptions |
| 📈 **Dashboard** | Summary stats, monthly area chart, category pie chart, recent activity |
| 📊 **Analytics** | Pie, area, and bar charts with spending insights and trend analysis |
| 🎯 **Budget Tracking** | Set category limits per month, progress bars, overspending alerts |
| 📥 **CSV Export** | Download all expenses as a CSV file |
| 🔍 **Filtering & Search** | By category, date range, and text search |
| 🌓 **Dark/Light Mode** | Toggle with system preference detection |
| 📱 **Responsive Design** | Sidebar navigation that collapses to a drawer on mobile |
| 🎨 **Glassmorphism UI** | Modern glass cards, gradients, and smooth animations |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Recharts |
| **Backend** | Node.js (native `http` module — no Express) |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **UI** | react-icons, react-hot-toast, Inter font |

---

## 📁 Project Structure

```
ExpenseTracker/
├── server/
│   ├── config/db.js             # MongoDB connection
│   ├── middleware/auth.js       # JWT auth middleware
│   ├── models/                  # User, Expense, Budget schemas
│   ├── controllers/             # Auth, Expense, Budget logic
│   ├── routes/                  # Route registrations
│   ├── utils/router.js          # Custom lightweight HTTP router
│   ├── server.js                # Entry point
│   └── .env.example             # Env template
├── client/
│   ├── src/
│   │   ├── api/axios.js         # Axios instance with JWT interceptor
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── components/          # Sidebar, Navbar, StatCard, etc.
│   │   ├── pages/               # Dashboard, Expenses, Analytics, Budget
│   │   ├── App.jsx              # Root component with routing
│   │   └── index.css            # Design system & Tailwind config
│   └── vite.config.js           # Vite + Tailwind + API proxy
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud URI

---

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ExpenseTracker
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_key_change_this
```

> **For MongoDB Atlas**, replace `MONGO_URI` with your connection string:
> `mongodb+srv://username:password@cluster.mongodb.net/expense-tracker`

### 3. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the application

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm start
# → Server running on port 5000

# Terminal 2 — Frontend
cd client
npm run dev
# → http://localhost:5173
```

### 5. Open in browser

Navigate to [http://localhost:5173](http://localhost:5173) — create an account and start tracking!

---

## 🔌 API Endpoints

### Authentication

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/signup` | Register user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Get profile |

### Expenses

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/expenses` | List (with filters) |
| `POST` | `/api/expenses` | Create expense |
| `PUT` | `/api/expenses/:id` | Update expense |
| `DELETE` | `/api/expenses/:id` | Delete expense |
| `GET` | `/api/expenses/analytics` | Aggregated analytics |
| `GET` | `/api/expenses/export` | Download CSV |

### Budgets

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/budgets` | List budgets |
| `POST` | `/api/budgets` | Set/update budget |
| `DELETE` | `/api/budgets/:id` | Delete budget |
| `GET` | `/api/budgets/status` | Spending vs limit status |

---

## 📸 Screenshots

> Add your screenshots here to showcase the application!

| Dashboard | Analytics | Budget |
|-----------|-----------|--------|
| ![Dashboard](screenshots/dashboard.png) | ![Analytics](screenshots/analytics.png) | ![Budget](screenshots/budget.png) |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for smart finance management
</p>
