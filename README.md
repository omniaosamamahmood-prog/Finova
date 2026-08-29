<div align="center">

<img src="client/public/finova-mark.png" alt="Finova logo" width="88" />

# Finova

**Smart personal finance** — track income, expenses, budgets, and savings goals in a clean, responsive, bilingual app.

[![Live Demo](docs/badges/live-demo.svg)](https://finova-app-omniaa.vercel.app/)

<br />

<img src="docs/badges/react.svg" alt="React" />
<img src="docs/badges/typescript.svg" alt="TypeScript" />
<img src="docs/badges/nodejs.svg" alt="Node.js" />
<img src="docs/badges/express.svg" alt="Express" />
<img src="docs/badges/postgresql.svg" alt="PostgreSQL" />
<img src="docs/badges/prisma.svg" alt="Prisma" />

<br />

**[Live Demo](https://finova-app-omniaa.vercel.app/)** · **[Report Bug](https://github.com/omniaosamamahmood-prog/Finova/issues)** · **[Request Feature](https://github.com/omniaosamamahmood-prog/Finova/issues)**

</div>

---

## Overview

Finova is a full-stack personal finance platform with authentication, budgeting, goals, recurring transactions, and financial insights. It supports **English** and **Arabic** (LTR/RTL), plus light and dark themes.

| | |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, Prisma, PostgreSQL |
| **Auth** | Email + password, Google OAuth, verification & reset |
| **Deploy** | Vercel (client) · Render (API) |

---

## Features

- Email and Google authentication
- Email verification, forgot password, and reset flow
- Income and expense tracking with categories
- Budget management and savings goals
- Recurring transactions
- Financial insights
- Light / dark mode
- Arabic & English (RTL / LTR)
- Fully responsive layout

---

## Tech Stack

### Frontend
React 19 · TypeScript · Vite · Tailwind CSS · React Router · React Hook Form · Zod · i18next · TanStack Query

### Backend
Node.js · Express · Prisma ORM · PostgreSQL · JWT · Google OAuth · Email (verification / reset)

### Deployment
Vercel (frontend) · Render (backend)

---

## Getting Started

### Clone

```bash
git clone https://github.com/omniaosamamahmood-prog/Finova.git
cd Finova
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## Environment Variables

### Client (`client/.env`)

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

### Server (`server/.env`)

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
EMAIL_USER=
EMAIL_PASS=
APP_URL=
```

---

## Project Structure

```text
Finova
├── client/          # React + Vite frontend
│   ├── public/
│   └── src/
├── server/          # Express + Prisma API
│   ├── prisma/
│   └── src/
├── docs/badges/     # README badge assets
└── README.md
```

---

## Roadmap

- [x] Authentication (email + Google)
- [x] Email verification & password reset
- [x] Transactions & categories
- [x] Budgets & savings goals
- [x] Recurring transactions
- [x] Financial insights
- [x] Responsive + bilingual UI
- [x] AI financial assistant
- [x] Export reports
- [ ] Notifications
- [ ] Deeper analytics dashboard

---

## Contributing

Contributions, issues, and feature requests are welcome. Open an issue or pull request on GitHub.

---

## Author

**Omnia Osama Mahmoud**

- GitHub: [omniaosamamahmood-prog](https://github.com/omniaosamamahmood-prog)
- LinkedIn: [omnia-osama-6754b3206](https://www.linkedin.com/in/omnia-osama-6754b3206)

---

<div align="center">

⭐ If Finova helps you, consider starring the repo.

</div>
