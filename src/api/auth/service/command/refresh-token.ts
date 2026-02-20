import { AuthRepository } from "../../repository/auth.repository";
import type { AuthSchema } from "../../schema/auth.schema";
import ApiError from "@error/api.error";
import { generateTokens } from "../../helper/token.helper";

/**
 * Execute refresh token command
 */
export async function refreshToken(
  data: AuthSchema.RefreshTokenDto,
): Promise<AuthSchema.AuthResponse> {
  // Verify refresh token
  const tokenData = await AuthRepository.findToken(data.refreshToken);

  if (!tokenData || tokenData.type !== "REFRESH" || tokenData.revoked) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Check if token is expired
  if (new Date() > tokenData.expires_at) {
    throw new ApiError(401, "Refresh token expired");
  }

  // Get user
  const user = tokenData.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Revoke old refresh token
  await AuthRepository.revokeToken(data.refreshToken);

  // Generate new tokens
  const tokens = await generateTokens(user.user_id);

  return {
    user: {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}
