import Elysia from "elysia";
import { AuthSchema } from "../schema/auth.schema";
import { authService } from "../service";
import { ErrorModel } from "@error/error";

export const authController = new Elysia({ prefix: "/auth" })
  .post("/register", async ({ body }) => await authService.register(body), {
    body: AuthSchema.requestRegister,
    detail: {
      summary: "Register a new user",
      tags: ["Authentication"],
    },
    response: {
      200: AuthSchema.resultRegister,
      400: ErrorModel.apiErrorUser,
      500: ErrorModel.apiErrorServer,
    },
  })
  .post("/login", async ({ body }) => await authService.login(body), {
    body: AuthSchema.requestLogin,
    detail: {
      summary: "Login user",
      tags: ["Authentication"],
    },
    response: {
      200: AuthSchema.resultLogin,
      400: ErrorModel.apiErrorUser,
      500: ErrorModel.apiErrorServer,
    },
  });
