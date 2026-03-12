# Copilot Instructions — Elysia Authentication

> Guidelines for GitHub Copilot and developers working on this project.

---

## 🗂 Project Structure

โครงสร้างจัดแบบ **layer-first** แล้วค่อยแบ่งตาม feature ภายในแต่ละ layer:

```
src/
└── api/
    ├── app.route.ts                    # register ทุก route ที่นี่
    ├── controller/
    │   └── <feature>.controller.ts     # e.g. auth.controller.ts
    ├── service/
    │   └── <feature>/
    │       ├── command/                # one file per use-case
    │       │   ├── create_<feature>.ts
    │       │   ├── update_<feature>.ts
    │       │   └── delete_<feature>.ts
    │       └── query/
    │           ├── <feature>.ts
    │           ├── <feature>.ts
    │           └── <feature>.ts
    ├── repository/
    │       custom/
    │       └── <feature>.repository.ts     # e.g. user.repository.ts
    │       generic/
    │       └── <feature>.repository.ts     # e.g. user.repository.ts
    └── schema/
        └── <feature>.schema.ts         # e.g. auth.schema.ts
```

All routes are registered in `src/api/app.route.ts` via `.group("/api/v1", ...)`.

---

## 📛 Naming Conventions

### Files → `snake_case`

Name files after the **feature + layer** they belong to.

```
✅ user.repository.ts
✅ auth.controller.ts
✅ create_post.ts
✅ auth.schema.ts

❌ userRepository.ts
❌ AuthController.ts
❌ createPost.ts
```

### Variables & Functions → `camelCase`

```ts
✅ const accessToken = jwtUtils.signAccessToken(...)
✅ const hashedPassword = await encryptPassword(password)
✅ const findUserByEmail = async (email: string) => { ... }

❌ const access_token = ...
❌ const hashed_password = ...
```

### Classes → `PascalCase`

```ts
✅ class ApiError extends Error { ... }
```

### Constants / Enums → `SCREAMING_SNAKE_CASE` (value) + `PascalCase` (key)

```ts
✅ export const Provider = {
     CREDENTIALS: "credentials",
     GOOGLE: "google",
   } as const;

✅ export const TokenType = {
     ACCESS: "ACCESS",
     REFRESH: "REFRESH",
   } as const;
```

### Database fields (Prisma) → `snake_case`

```prisma
✅ user_id     String
✅ created_at  DateTime
✅ is_active   Boolean
```

---

## 🏗 Layers & Responsibilities

| Layer          | Location                                 | Responsibility                                              |
| -------------- | ---------------------------------------- | ----------------------------------------------------------- |
| **Controller** | `api/controller/<feature>.controller.ts` | รับ request, validate input, เรียก service, return response |
| **Service**    | `api/service/<feature>/command/<use_case>.ts` | Business logic — 1 file ต่อ 1 use-case                 |
| **Repository** | `api/repository/<feature>.repository.ts` | Database queries เท่านั้น ห้ามมี business logic             |
| **Schema**     | `api/schema/<feature>.schema.ts`         | TypeBox schema + TypeScript types (ใช้ `namespace`)         |

### Schema Pattern

ใช้ `namespace` เพื่อจัดกลุ่ม types ของแต่ละ feature:

```ts
// src/api/auth/schema/auth.schema.ts
export namespace AuthSchema {
  export const requestLogin = t.Object({ ... });
  export type RequestLogin = typeof requestLogin.static;
}
```

### Repository Pattern

Repository ต้องมี 2 versions สำหรับ method ที่ต้องใช้ใน transaction:

```ts
export const userRepository = {
  // ใช้งานทั่วไป
  findUserByEmail: async (email: string) => { ... },

  // ใช้ใน prisma.$transaction
  createUserWithTx: async (tx: TransactionClient, data: ...) => { ... },
};
```

---

## ⚠️ Error Handling

### Error Code System

Error codes ถูกแบ่งตาม service โดยใช้ prefix เป็น namespace:

| Service        | Prefix | Range           |
| -------------- | ------ | --------------- |
| Auth           | `1`    | `1001` – `1099` |
| User           | `2`    | `2001` – `2099` |
| (next service) | `3`    | `3001` – `3099` |

### เพิ่ม Service Error ใหม่

1. สร้างไฟล์ `src/error/custom_error/<n>_<service>.ts`:

```ts
// src/error/custom_error/2_user.ts
export const userError = {
  USER_NOT_FOUND: { code: 2001, message: "User not found" },
  PERMISSION_DENIED: { code: 2002, message: "Permission denied" },
} as const;
```

2. Import เข้า `src/error/error_message.ts`:

```ts
import { authError } from "./custom_error/1_auth";
import { userError } from "./custom_error/2_user";

export const customError = {
  ...authError,
  ...userError,
} as const;
```

3. Throw ใน service:

```ts
throw new ApiError(customError.USER_NOT_FOUND);
```

Response format:

```json
{ "code": 2001, "message": "User not found" }
```

---

## 🔗 Path Aliases

ใช้ alias เสมอ ห้าม import ด้วย relative path ที่ยาวกว่า 1 ระดับ:

```ts
✅ import { prisma } from "@lib/prisma";
✅ import { customError } from "@error/error_message";
✅ import { userRepository } from "@api/user";

❌ import { prisma } from "../../../lib/prisma";
```

| Alias           | Path                   |
| --------------- | ---------------------- |
| `@lib/*`        | `src/lib/*`            |
| `@error/*`      | `src/error/*`          |
| `@util/*`       | `src/util/*`           |
| `@config/*`     | `src/config/*`         |
| `@controller/*` | `src/api/controller/*` |
| `@service/*`    | `src/api/service/*`    |
| `@repository/*` | `src/api/repository/*` |
| `@generated/*`  | `src/generated/*`      |
| `@middleware/*` | `src/middleware/*`     |
| `@script/*`     | `src/script/*`         |

---

## 🌿 Environment Variables

ตัวแปร env ทั้งหมดต้องนิยาม schema ใน `src/config/env.ts` ด้วย Zod:

```ts
const envSchema = z.object({
  PORT: z.string().default("8000"),
  DATABASE_URL: z.url(),
  ACCESS_TOKEN_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
```

ห้าม `process.env.XXX` โดยตรงในโค้ด ให้ import `env` จาก `@config/env` เสมอ

---

## 🔐 Security Guidelines

- **Password** — hash ด้วย Argon2id เสมอ (`@util/encryption`)
- **JWT** — ใช้ `jwtUtils` จาก `@lib/jwt` เท่านั้น
- **Error message** — ห้ามบอกรายละเอียดว่า user ไม่มีอยู่หรือ password ผิด ให้ใช้ `INVALID_CREDENTIALS` เสมอ
- **Transaction** — ทุก operation ที่ต้องเขียน DB หลายตาราง ต้องใช้ `prisma.$transaction`
