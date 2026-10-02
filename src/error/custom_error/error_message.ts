import { authError } from "./1_auth";
import { defaultError } from "./0_default";

export const customError = {
  ...defaultError,
  ...authError,
} as const;

export type CustomErrorEntry = {
  code: string;
  message: string;
};
