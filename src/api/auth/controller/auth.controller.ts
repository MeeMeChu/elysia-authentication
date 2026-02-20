import Elysia, { t } from "elysia";
import { AuthSchema } from "../schema/auth.schema";
import { authService } from "../service";

export const authController = new Elysia({ prefix: "/auth" })
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  .post(
    "/register",
    async ({ body }) => {
      const result = await authService.register(body as AuthSchema.RegisterDto);
      return {
        success: true,
        data: result,
      };
    },
    {
      body: AuthSchema.register,
      detail: {
        summary: "Register a new user",
        tags: ["Authentication"],
      },
    },
  )

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  .post(
    "/login",
    async ({ body }) => {
      const result = await authService.login(body as AuthSchema.LoginDto);
      return {
        success: true,
        data: result,
      };
    },
    {
      body: AuthSchema.login,
      detail: {
        summary: "Login user",
        tags: ["Authentication"],
      },
    },
  )

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  .post(
    "/refresh",
    async ({ body }) => {
      const result = await authService.refreshToken(body as AuthSchema.RefreshTokenDto);
      return {
        success: true,
        data: result,
      };
    },
    {
      body: AuthSchema.refreshToken,
      detail: {
        summary: "Refresh access token",
        tags: ["Authentication"],
      },
    },
  )

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  .post(
    "/logout",
    async ({ body }) => {
      const data = body as AuthSchema.RefreshTokenDto;
      await authService.logout(data.refreshToken);
      return {
        success: true,
        message: "Logged out successfully",
      };
    },
    {
      body: AuthSchema.refreshToken,
      detail: {
        summary: "Logout user",
        tags: ["Authentication"],
      },
    },
  )

  /**
   * Get current user profile (protected route example)
   * GET /api/v1/auth/me
   */
  .get(
    "/me",
    async ({ headers }) => {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
      }

      const token = authHeader.substring(7);
      const user = await authService.verifyAccessToken(token);

      return {
        success: true,
        data: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      };
    },
    {
      detail: {
        summary: "Get current user profile",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
