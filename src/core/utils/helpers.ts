import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { config } from '../config';

export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.security.bcryptRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const parsePagination = (
  page: number = 1,
  limit: number = 10,
): { offset: number; limit: number } => {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit));
  return {
    offset: (validPage - 1) * validLimit,
    limit: validLimit,
  };
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const parseDurationToSeconds = (duration: string): number => {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1), 10);

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return parseInt(duration, 10) || 3600;
  }
};
