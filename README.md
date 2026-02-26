# Elysia Authentication

A production-ready **JWT Authentication REST API** built with **Bun** + **Elysia** + **Prisma** + **PostgreSQL**

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh) >= 1.3.0 |
| Framework | [Elysia](https://elysiajs.com) |
| Database | PostgreSQL |
| ORM | [Prisma](https://www.prisma.io) v7 |
| Password Hashing | Argon2id |
| Token | JWT (Access + Refresh) |
| Validation | Elysia TypeBox / Zod |
| Logging | Pino |
| Object Storage | MinIO |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.0
- PostgreSQL (or use Docker)
- MinIO (optional, for object storage)

### 1. Clone & Install

```bash
git clone <repo-url>
cd elysia-authentication
bun install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

```env
NODE_ENV=development
PORT=8000

DATABASE_URL=postgresql://user:password@localhost:5432/elysia_auth

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3. Start Database (Docker)

```bash
docker compose up -d
```

### 4. Run Migrations & Seed

```bash
bun prisma db push
bun prisma generate
bun run dev
```

### 5. Start Development Server

```bash
bun run dev
```

Server will be running at `http://localhost:8000`

---

## 📜 Scripts

```bash
bun run dev        # Start dev server with hot reload
bun run build      # Build for production
bun run start      # Start production server
```
