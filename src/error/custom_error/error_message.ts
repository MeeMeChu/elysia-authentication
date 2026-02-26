import { authError } from "./1_auth";
// import { userError } from "./user";  ← เพิ่ม service ใหม่ตรงนี้

export const customError = {
  ...authError,
  // user: userError,
} as const;

export type CustomErrorEntry = {
  code: number;
  message: string;
};

