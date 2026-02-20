import { verifyJwt } from "@api/auth/helper/token.helper";
import { AuthRepository } from "@api/auth/repository/auth.repository";
import ApiError from "@error/api.error";

/**
 * Verify access token and return user
 */
export async function verifyAccessToken(token: string) {
  try {
    const payload = await verifyJwt(token);

    if (!payload || !payload.sub) {
      throw new ApiError(401, "Invalid token");
    }

    const user = await AuthRepository.findUserById(payload.sub as string);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Invalid or expired token");
  }
}
