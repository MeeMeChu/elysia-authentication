import { t } from "elysia";

export namespace AuthSchema {
  // Request Schemas
  export const requestRegister = t.Object({
    email: t.String({ format: "email" }),
    username: t.String({ minLength: 3 }),
    password: t.String({ minLength: 8 }),
    fullname: t.String(),
  });
  export const resultRegister = t.Object({
    user_id: t.String(),
    email: t.String(),
    username: t.String(),
    role: t.String(),
    is_active: t.Boolean(),
  });

  export const requestLogin = t.Object({
    email_or_username: t.String(),
    password: t.String(),
  });
  export const resultLogin = t.Object({
    access_token: t.String(),
    refresh_token: t.String(),
  });

  export const refreshToken = t.Object({
    refreshToken: t.String(),
  });

  // Types
  export type RequestRegister = typeof requestRegister.static;
  export type ResultRegister = typeof resultRegister.static;

  export type RequestLogin = typeof requestLogin.static;
  export type ResultLogin = typeof resultLogin.static;

  export type RequestRefreshToken = typeof refreshToken.static;
}
