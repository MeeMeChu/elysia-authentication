import Elysia from "elysia";
import { AuthSchema } from "../schema/auth.schema";
import { authService } from "../service";

export const authController = new Elysia()
  .post(
    "/register",
    async ({ body }) => {
      const result = await authService.register(body as AuthSchema.RequestRegister);
      return {
        success: true,
        data: result,
      };
    },
    {
      body: AuthSchema.requestRegister,
      detail: {
        summary: "Register a new user",
        tags: ["Authentication"],
      },
    },
  )
  .post(
    "/login",
    async ({ body }) => {
      const result = await authService.login(body as AuthSchema.RequestLogin);
      return {
        success: true,
        data: result,
      };
    },
    {
      body: AuthSchema.requestLogin,
      detail: {
        summary: "Login user",
        tags: ["Authentication"],
      },
    },
  );
