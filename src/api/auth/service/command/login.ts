import { AuthRepository } from "../../repository/auth.repository";
import type { AuthSchema } from "../../schema/auth.schema";
import ApiError from "@error/api.error";
import { generateTokens } from "../../helper/token.helper";

/**
 * Execute login command
 */
export async function login(
  data: AuthSchema.LoginDto,
): Promise<AuthSchema.AuthResponse> {
  // Find user
  const user = await AuthRepository.findUserByEmail(data.email);
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Verify password
  const isValidPassword = await Bun.password.verify(data.password, user.password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user.user_id);

  return {
    user: {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}
