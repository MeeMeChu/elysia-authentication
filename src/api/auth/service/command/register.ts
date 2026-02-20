import { AuthRepository } from "../../repository/auth.repository";
import type { AuthSchema } from "../../schema/auth.schema";
import ApiError from "@error/api.error";
import { generateTokens } from "../../helper/token.helper";

/**
 * Execute register command
 */
export async function register(
  data: AuthSchema.RegisterDto,
): Promise<AuthSchema.AuthResponse> {
  // Check if user already exists
  const existingUser = await AuthRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // Hash password
  const hashedPassword = await Bun.password.hash(data.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // Create user
  const user = await AuthRepository.createUser(data.email, data.username, hashedPassword);

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
