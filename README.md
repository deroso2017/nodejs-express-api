# 🚀 Node.js Express REST API

A production-ready REST API built with **Express**, **TypeScript**, **Prisma ORM** and **Microsoft SQL Server** — featuring JWT authentication, password reset via email, and full user CRUD.

---

## 🛠 Tech Stack

| | Technology | Version |
|---|---|---|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square) | Node.js | ≥ 18 |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) | TypeScript | 6.x |
| ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=flat-square) | Express | 5.x |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=flat-square) | Prisma ORM | 7.x |
| ![MSSQL](https://img.shields.io/badge/Microsoft_SQL_Server-CC2927?logo=microsoftsqlserver&logoColor=white&style=flat-square) | MS SQL Server | 2019+ |
| ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square) | JSON Web Token | 9.x |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white&style=flat-square) | Zod | 4.x |

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client Request                   │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                  Express App (src/index.ts)          │
│              express.json() │ /health                │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│               Routes  /api/v1                        │
│         ┌────────────┴────────────┐                 │
│       /auth                    /users                │
└─────────┬──────────────────────┬─────────────────────┘
          │                      │
          ▼                      ▼
┌──────────────────┐   ┌──────────────────────────────┐
│  validate()      │   │  authenticate()  (JWT guard) │
│  (Zod schema)    │   └──────────────┬───────────────┘
└────────┬─────────┘                  │
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────┐
│              Controllers                             │
│     auth.controller.ts │ user.controller.ts          │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│           Prisma ORM  (@prisma/adapter-mssql)        │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Microsoft SQL Server                    │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── auth.controller.ts     # register, login, me, forgot/reset password
│   └── user.controller.ts     # CRUD + pagination
├── lib/
│   ├── jwt.ts                 # sign / verify token
│   ├── mailer.ts              # nodemailer (ethereal dev / SMTP prod)
│   └── prisma.ts              # Prisma client singleton
├── middleware/
│   ├── authenticate.ts        # JWT bearer guard
│   ├── errorHandler.ts        # global error handler
│   └── validate.ts            # Zod request body validation
├── routes/
│   └── v1/
│       ├── auth.ts
│       ├── users.ts
│       └── index.ts
├── validators/
│   ├── auth.validator.ts
│   ├── user.validator.ts
│   └── password.validator.ts
└── index.ts                   # app entry point

prisma/
├── schema.prisma
└── migrations/
```

---

## 🔌 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `GET` | `/me` | ✅ | Get current user |
| `POST` | `/forgot-password` | ❌ | Send password reset email |
| `POST` | `/reset-password` | ❌ | Reset password with token |

### Users — `/api/v1/users`

> All routes require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List users (paginated) |
| `GET` | `/:id` | Get user by ID |
| `POST` | `/` | Create user |
| `PUT` | `/:id` | Update user |
| `DELETE` | `/:id` | Delete user |

### Pagination query params

| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `page` | `1` | — | Page number |
| `limit` | `10` | `100` | Items per page |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (use `.env.example` as reference):

```env
# Database
DATABASE_URL="sqlserver://localhost:1433;database=mydb;user=sa;password=secret;encrypt=true;trustServerCertificate=true"

# Server
PORT=8000
NODE_ENV=development
APP_URL="http://localhost:8000"

# JWT
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="7d"

# SMTP (only required in production)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="user@example.com"
SMTP_PASS="password"
SMTP_FROM="noreply@example.com"
```

> In `development`, password reset emails are sent to [Ethereal](https://ethereal.email/) and a preview URL is logged to the console — no SMTP setup required.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Microsoft SQL Server (local or remote)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Run migrations
npm run prisma:migrate

# 4. Generate Prisma client
npm run prisma:generate

# 5. Start development server
npm run dev
```

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon + ts-node |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:generate` | Generate Prisma client |

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (cost factor 10)
- Password reset tokens hashed with **SHA-256** before storage
- Reset tokens expire after **1 hour**
- Forgot password endpoint returns the same response whether the email exists or not (prevents email enumeration)
- JWT validated on every protected route via `Authorization: Bearer <token>` header
