import { prisma } from "@lib/prisma";
import { TokenType } from "@generated/prisma/enums";

type PrismaClient = typeof prisma;
type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const tokenRepository = {
  getTokenByUserId: async (userId: string) => {
    return await prisma.tokens.findFirst({
      where: {
        user_id: userId,
      },
    });
  },

  createToken: async (data: {
    token_id: string;
    token: string;
    type: TokenType;
    expires_at: Date;
    user_id: string;
  }) => {
    return await prisma.tokens.create({
      data,
    });
  },

  // สำหรับใช้ใน transaction
  createTokenWithTx: async (
    tx: TransactionClient,
    data: {
      token_id: string;
      token: string;
      type: TokenType;
      expires_at: Date;
      user_id: string;
    }
  ) => {
    return await tx.tokens.create({
      data,
    });
  },

  findTokenByValue: async (token: string) => {
    return await prisma.tokens.findUnique({
      where: {
        token,
      },
    });
  },

  revokeToken: async (tokenId: string) => {
    return await prisma.tokens.update({
      where: {
        token_id: tokenId,
      },
      data: {
        revoked: true,
      },
    });
  },

  deleteExpiredTokens: async () => {
    return await prisma.tokens.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });
  },
};
