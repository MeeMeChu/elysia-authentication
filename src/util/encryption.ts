import argon2 from "argon2";

export const encryptPassword = async (password: string): Promise<string> => {
  const encryptedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
  return encryptedPassword;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await argon2.verify(hash, password);
};
