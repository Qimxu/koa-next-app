import { SignJWT, jwtVerify, decodeJwt } from 'jose';
import { config } from '../config';

export interface JWTPayload {
  sub: number;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

const getSecretKey = (secret: string): Uint8Array => {
  return new TextEncoder().encode(secret);
};

export const generateTokens = async (payload: Omit<JWTPayload, 'type'>) => {
  const now = Math.floor(Date.now() / 1000);

  // jose 库要求 sub 为 string，需要转换
  const basePayload = {
    sub: String(payload.sub),
    email: payload.email,
    role: payload.role,
  };

  const accessToken = await new SignJWT({ ...basePayload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(config.jwt.expiresIn)
    .sign(getSecretKey(config.jwt.secret));

  const refreshToken = await new SignJWT({ ...basePayload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(config.jwt.refreshExpiresIn)
    .sign(getSecretKey(config.jwt.refreshSecret));

  return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, getSecretKey(config.jwt.secret));
  return payload as unknown as JWTPayload;
};

export const verifyRefreshToken = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, getSecretKey(config.jwt.refreshSecret));
  return payload as unknown as JWTPayload;
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = decodeJwt(token);
    if (!decoded) return null;
    return decoded as unknown as JWTPayload;
  } catch {
    return null;
  }
};

export const getTokenExpiresInSeconds = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 3600;
  return decoded.exp - Math.floor(Date.now() / 1000);
};
