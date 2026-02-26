import { v4 as uuidv4 } from "uuid";
import { prisma } from "@lib/prisma";
import { logger } from "@lib/logger";
import ApiError from "@error/api.error";
import { customError } from "@error/custom_error/error_message";
import { UserRole } from "@generated/prisma/enums";
import { encryptPassword } from "@util/encryption";

import { Provider } from "@util/provider";
import { AuthSchema } from "@schema/auth/auth.schema";
import { userRepository } from "@repository/generic/user.repository";
import { accountRepository } from "@repository/generic/account.repository";

export const register = async (
  data: AuthSchema.RequestRegister,
): Promise<AuthSchema.ResultRegister> => {
  const { email, username, password, fullname } = data;

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    logger.warn(`Registration attempt with existing email: ${email}`);
    throw new ApiError(409, customError.EMAIL_ALREADY_IN_USE);
  }

  const existingUsername = await userRepository.findUserByUsername(username);
  if (existingUsername) {
    logger.warn(`Registration attempt with existing username: ${username}`);
    throw new ApiError(409, customError.USERNAME_ALREADY_IN_USE);
  }

  const userId = uuidv4();
  const hashedPassword = await encryptPassword(password);

  // ใช้ transaction เพื่อให้แน่ใจว่าข้อมูลทุกส่วนถูกบันทึกพร้อมกัน
  try {
    const result = await prisma.$transaction(async (tx) => {
      // สร้าง user ผ่าน repository
      const user = await userRepository.createUserWithTx(tx, {
        user_id: userId,
        user_status_id: 1,
        email,
        username,
        fullname,
        role: [UserRole.USER],
        is_active: true,
        created_by: userId,
        updated_by: userId,
      });

      // สร้าง account ผ่าน repository
      await accountRepository.createAccountWithTx(tx, {
        account_id: uuidv4(),
        user_id: userId,
        provider: Provider.CREDENTIALS,
        provider_account_id: email,
        password: hashedPassword,
      });

      return {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
        is_active: user.is_active,
      };
    });

    logger.info(`User registered successfully: ${email}`);
    return result;
  } catch (error) {
    logger.error(`Registration failed for email: ${error}`);
    throw new ApiError(500, customError.REGISTRATION_FAILED);
  }
};
