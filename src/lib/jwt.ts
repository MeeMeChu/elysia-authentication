import * as jwt from "jsonwebtoken";
import { env } from "@config/env";
import { TokenType, UserRole } from "@generated/prisma/enums";

interface AccessTokenPayload {
  user_id: string;
  email: string;
  role: UserRole[];
}

interface RefreshTokenPayload {
  type: TokenType;
  user_id: string;
}

export const jwtUtils = {
  /**
   * สร้าง Access Token
   * @param payload - ข้อมูลที่ต้องการเก็บใน token (userId, email, role)
   * @param expiresIn - ระยะเวลาหมดอายุ (default: 15m)
   * @returns JWT token string
   */
  signAccessToken: (payload: AccessTokenPayload, expiresIn: string = "15m"): string => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn } as jwt.SignOptions);
  },

  /**
   * สร้าง Refresh Token
   * @param payload - ข้อมูลที่ต้องการเก็บใน token (userId)
   * @param expiresIn - ระยะเวลาหมดอายุ (default: 7d)
   * @returns JWT token string
   */
  signRefreshToken: (payload: RefreshTokenPayload, expiresIn: string = "7d"): string => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn } as jwt.SignOptions);
  },

  /**
   * ตรวจสอบและ decode Access Token
   * @param token - JWT token string
   * @returns decoded payload หรือ null ถ้า token ไม่ valid
   */
  verifyAccessToken: (token: string): AccessTokenPayload | null => {
    try {
      return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
    } catch (error) {
      return null;
    }
  },

  /**
   * ตรวจสอบและ decode Refresh Token
   * @param token - JWT token string
   * @returns decoded payload หรือ null ถ้า token ไม่ valid
   */
  verifyRefreshToken: (token: string): RefreshTokenPayload | null => {
    try {
      return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
    } catch (error) {
      return null;
    }
  },
};
