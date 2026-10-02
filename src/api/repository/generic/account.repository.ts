import { db, TransactionClient } from "@lib/prisma";

export const accountRepository = {
  // สำหรับใช้ใน transaction
  createAccountWithTx: async (
    tx: TransactionClient,
    data: {
      account_id: string;
      user_id: string;
      provider: string;
      provider_account_id: string;
      password?: string;
    },
  ) => {
    return await tx.accounts.create({
      data,
    });
  },

  findAccountByProvider: async (provider: string, providerAccountId: string) => {
    return await db.accounts.findUnique({
      where: {
        provider_provider_account_id: {
          provider,
          provider_account_id: providerAccountId,
        },
      },
    });
  },

  findAccountByUserId: async (userId: string) => {
    return await db.accounts.findFirst({
      where: {
        user_id: userId,
      },
    });
  },
};
