import { prisma } from "@lib/prisma";
import { TokenType, UserRole } from "@generated/prisma/enums";

export const AuthRepository = {
  // User operations
  async findUserByEmail(email: string) {
    return await prisma.users.findUnique({
      where: { email },
    });
  },

  async findUserById(userId: string) {
    return await prisma.users.findUnique({
      where: { user_id: userId },
    });
  },

  async createUser(
    email: string,
    username: string,
    hashedPassword: string,
    role: UserRole = "USER",
  ) {
    return await prisma.users.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
        created_by: email,
        updated_by: email,
      },
    });
  },

  // Token operations
  async createToken(userId: string, token: string, type: TokenType, expiresAt: Date) {
    return await prisma.tokens.create({
      data: {
        user_id: userId,
        token,
        type,
        expires_at: expiresAt,
      },
    });
  },

  async findToken(token: string) {
    return await prisma.tokens.findUnique({
      where: { token },
      include: { user: true },
    });
  },

  async revokeToken(token: string) {
    return await prisma.tokens.update({
      where: { token },
      data: { revoked: true },
    });
  },

  async revokeUserTokens(userId: string, type?: TokenType) {
    return await prisma.tokens.updateMany({
      where: {
        user_id: userId,
        type: type,
        revoked: false,
      },
      data: { revoked: true },
    });
  },

  async deleteExpiredTokens() {
    return await prisma.tokens.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });
  },
};
