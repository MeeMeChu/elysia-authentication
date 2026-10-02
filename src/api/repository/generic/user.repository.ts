import { UserRole } from "@generated/prisma/enums";
import { db, TransactionClient } from "@lib/prisma";

export const userRepository = {
  findUsers: async () => {
    return await db.users.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  },

  findUserById: async (userId: string) => {
    return await db.users.findUnique({
      where: {
        user_id: userId,
      },
    });
  },

  findUserByEmail: async (email: string) => {
    return await db.users.findUnique({
      where: {
        email,
      },
    });
  },

  findUserByUsername: async (username: string) => {
    return await db.users.findUnique({
      where: {
        username,
      },
    });
  },

  createUser: async (data: {
    email: string;
    user_status_id: number;
    username: string;
    fullname: string;
    role?: UserRole[];
    created_by: string;
    updated_by: string;
  }) => {
    return await db.users.create({
      data,
    });
  },

  // สำหรับใช้ใน transaction
  createUserWithTx: async (
    tx: TransactionClient,
    data: {
      user_id: string;
      user_status_id: number;
      email: string;
      username: string;
      fullname: string;
      role?: UserRole[];
      is_active?: boolean;
      created_by: string;
      updated_by: string;
    },
  ) => {
    return await tx.users.create({
      data,
    });
  },

  updateUser: async (
    userId: string,
    data: {
      email?: string;
      username?: string;
      fullname?: string;
      role?: UserRole[];
      is_active?: boolean;
      updated_by: string;
    },
  ) => {
    return await db.users.update({
      where: {
        user_id: userId,
      },
      data,
    });
  },

  deleteUser: async (userId: string) => {
    return await db.users.delete({
      where: {
        user_id: userId,
      },
    });
  },

  toggleUserActiveStatus: async (userId: string, isActive: boolean, updatedBy: string) => {
    return await db.users.update({
      where: {
        user_id: userId,
      },
      data: {
        is_active: isActive,
        updated_by: updatedBy,
      },
    });
  },
};
