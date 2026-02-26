import { UserStatus } from "@generated/prisma/client";
import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";

export const createDefaultUserStatus = async () => {
  const defaultStatuses: Omit<UserStatus, "created_at" | "updated_at">[] = [
    {
      user_status_id: 1,
      name: "ยังไม่ยืนยันตัวตน",
      is_active: true,
      created_by: "system",
      updated_by: "system",
    },
    {
      user_status_id: 2,
      name: "ยืนยันตัวตนแล้ว",
      is_active: true,
      created_by: "system",
      updated_by: "system",
    },
    {
      user_status_id: 3,
      name: "ถูกระงับ",
      is_active: false,
      created_by: "system",
      updated_by: "system",
    },
  ];

  await prisma.userStatus.createMany({
    data: defaultStatuses,
    skipDuplicates: true,
  });

  logger.info("[Seed] Default user statuses created or already exist.");
};

// export const ensureBucketExists = async () => {
//   const exists = await minioClient.bucketExists(BUCKET_NAME);
//   if (!exists) {
//     await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
//     logger.info(`[Seed] Bucket "${BUCKET_NAME}" created successfully.`);
//   } else {
//     logger.info(`[Seed] Bucket "${BUCKET_NAME}" already exists.`);
//   }
// };

export const runningSeeds = async () => {
  try {
    await createDefaultUserStatus();
    // await ensureBucketExists();
    logger.info("[Seed] Seeding completed successfully.");
  } catch (error) {
    logger.error({ err: error }, "Error running seed:");
  }
};
