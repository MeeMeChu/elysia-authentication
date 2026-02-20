import { t } from "elysia";

export namespace AuthSchema {
  // Request Schemas
  export const register = t.Object({
    email: t.String({ format: "email" }),
    username: t.String({ minLength: 3 }),
    password: t.String({ minLength: 8 }),
  });

  export const login = t.Object({
    email: t.String({ format: "email" }),
    password: t.String(),
  });

  export const refreshToken = t.Object({
    refreshToken: t.String(),
  });

  // Response Schemas
  export const authResponse = t.Object({
    user: t.Object({
      user_id: t.String(),
      email: t.String(),
      role: t.String(),
    }),
    accessToken: t.String(),
    refreshToken: t.String(),
  });

  export const messageResponse = t.Object({
    message: t.String(),
  });

  // Types
  export type RegisterDto = typeof register.static;
  export type LoginDto = typeof login.static;
  export type RefreshTokenDto = typeof refreshToken.static;
  export type AuthResponse = typeof authResponse.static;
}
