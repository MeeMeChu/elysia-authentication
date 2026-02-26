import { v4 as uuidv4 } from "uuid";
import { logger } from "@lib/logger";
import { jwtUtils } from "@lib/jwt";
import { userRepository } from "@api/user";
import { verifyPassword } from "@util/encryption";
import { Provider } from "@util/provider";
import { TokenType } from "@generated/prisma/enums";
import ApiError from "@error/api.error";
import { accountRepository } from "../../repository/account.repository";
import { tokenRepository } from "../../repository/token.repository";

import type { AuthSchema } from "../../schema/auth.schema";
import { customError } from "@error/custom_error/error_message";
import dayjs from "dayjs";
import { env } from "@config/env";

export const login = async (data: AuthSchema.RequestLogin): Promise<AuthSchema.ResultLogin> => {
  const { email_or_username, password } = data;

  // หา user จาก email หรือ username
  const isEmail = email_or_username.includes("@");
  const user = isEmail
    ? await userRepository.findUserByEmail(email_or_username)
    : await userRepository.findUserByUsername(email_or_username);

  if (!user || !user.is_active) {
    logger.warn(`Login attempt failed for: ${email_or_username}`);
    throw new ApiError(401, customError.INVALID_CREDENTIALS);
  }

  if (user.user_status_id === 1) {
    logger.warn(`Login attempt with unverified user: ${email_or_username}`);
    throw new ApiError(403, customError.USER_NOT_VERIFIED);
  }

  // หา account credentials ของ user
  const account = await accountRepository.findAccountByProvider(Provider.CREDENTIALS, user.email);

  if (!account || !account.password) {
    logger.warn(`No credentials account found for: ${email_or_username}`);
    throw new ApiError(401, customError.INVALID_CREDENTIALS);
  }

  // ตรวจสอบ password
  const isPasswordValid = await verifyPassword(password, account.password);
  if (!isPasswordValid) {
    logger.warn(`Invalid password for: ${email_or_username}`);
    throw new ApiError(401, customError.INVALID_CREDENTIALS);
  }

  // สร้าง tokens
  const access_token = jwtUtils.signAccessToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
  });

  const refresh_token = jwtUtils.signRefreshToken({
    type: TokenType.REFRESH,
    user_id: user.user_id,
  });

  // บันทึก refresh token ลง DB
  await tokenRepository.createToken({
    token_id: uuidv4(),
    token: refresh_token,
    type: TokenType.REFRESH,
    expires_at: dayjs()
      .add(parseInt(env.REFRESH_TOKEN_EXPIRES_IN.split("d")[0]), "days")
      .toDate(), // 7 days
    user_id: user.user_id,
  });

  logger.info(`User logged in successfully: ${user.email}`);

  return { access_token, refresh_token };
};
