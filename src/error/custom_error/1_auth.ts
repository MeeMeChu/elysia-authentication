// Auth service error codes: 1001 - 1099
export const authError = {
  EMAIL_ALREADY_IN_USE: { code: 1001, message: "Email already in use" },
  USERNAME_ALREADY_IN_USE: { code: 1002, message: "Username already in use" },
  INVALID_CREDENTIALS: { code: 1003, message: "Invalid email or password" },
  UNAUTHORIZED: { code: 1004, message: "Unauthorized" },
  REGISTRATION_FAILED: {
    code: 1005,
    message: "Registration failed, please try again",
  },
  USER_NOT_VERIFIED: { code: 1006, message: "User is not verified" },
  TOKEN_EXPIRED: { code: 1007, message: "Token has expired" },
  TOKEN_INVALID: { code: 1008, message: "Token is invalid" },
} as const;

export type AuthErrorKey = keyof typeof authError;
export type AuthErrorEntry = (typeof authError)[AuthErrorKey];
