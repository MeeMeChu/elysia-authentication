import { login } from "./command/login";
import { logout } from "./command/logout";
import { refreshToken } from "./command/refresh-token";
import { register } from "./command/register";
import { verifyAccessToken } from "@util/jwt";

export const authService = {
  login,
  logout,
  refreshToken,
  register,
  verifyAccessToken,
};
