import { env } from "@config/env";
import { AuthRepository } from "../repository/auth.repository";

const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // 7 days

/**
 * Generate access and refresh tokens
 */
export async function generateTokens(userId: string) {
  // Generate access token (JWT)
  const accessToken = await signJwt({ sub: userId, type: "access" }, ACCESS_TOKEN_EXPIRES_IN);

  // Generate refresh token (random string stored in DB)
  const refreshTokenValue = crypto.randomUUID();
  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7); // 7 days

  // Store refresh token in database
  await AuthRepository.createToken(userId, refreshTokenValue, "REFRESH", refreshExpiresAt);

  return {
    accessToken,
    refreshToken: refreshTokenValue,
  };
}

/**
 * Sign JWT token
 */
export async function signJwt(payload: any, expiresIn: string): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = calculateExpiration(now, expiresIn);

  const jwtPayload = {
    ...payload,
    iat: now,
    exp: exp,
  };

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(jwtPayload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Sign with secret
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.JWT_ACCESS_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signatureInput));

  // Convert signature to base64url
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${encodedHeader}.${encodedPayload}.${base64Signature}`;
}

/**
 * Verify JWT token
 */
export async function verifyJwt(token: string): Promise<any> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Verify signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.JWT_ACCESS_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signatureBytes = Uint8Array.from(
    atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(signatureInput),
  );

  if (!isValid) {
    throw new Error("Invalid signature");
  }

  // Decode payload
  const payload = JSON.parse(atob(encodedPayload));

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error("Token expired");
  }

  return payload;
}

/**
 * Calculate expiration timestamp
 */
function calculateExpiration(now: number, expiresIn: string): number {
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1));

  switch (unit) {
    case "s":
      return now + value;
    case "m":
      return now + value * 60;
    case "h":
      return now + value * 60 * 60;
    case "d":
      return now + value * 60 * 60 * 24;
    default:
      return now + 900; // Default 15 minutes
  }
}
