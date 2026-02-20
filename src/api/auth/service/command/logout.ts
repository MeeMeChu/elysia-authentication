import { AuthRepository } from "../../repository/auth.repository";
import ApiError from "@error/api.error";

/**
 * Execute logout command
 */
export async function logout(refreshToken: string): Promise<void> {
  const tokenData = await AuthRepository.findToken(refreshToken);

  if (!tokenData) {
    throw new ApiError(401, "Invalid token");
  }

  // Revoke all user tokens
  await AuthRepository.revokeUserTokens(tokenData.user_id);
}
