import type { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { hashToken } from "../../utils/token.js";

type DbClient = PrismaClient | Prisma.TransactionClient;

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  timezone?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const sanitizeUser = (user: {
  id: string;
  fullName: string;
  email: string;
  timezone: string;
  streakFreezeCredits: number;
  createdAt: Date;
}) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  timezone: user.timezone,
  streakFreezeCredits: user.streakFreezeCredits,
  createdAt: user.createdAt,
});

const issueTokenPair = async (
  db: DbClient,
  user: { id: string; email: string },
) => {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
  const refreshPayload = verifyRefreshToken(refreshToken);

  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(refreshPayload.exp * 1000),
    },
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (payload: RegisterPayload) => {
  const email = payload.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("Email is already in use", 409);
  }

  const user = await prisma.user.create({
    data: {
      fullName: payload.fullName.trim(),
      email,
      passwordHash: await hashPassword(payload.password),
      timezone: payload.timezone ?? "UTC",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      timezone: true,
      streakFreezeCredits: true,
      createdAt: true,
    },
  });

  const tokens = await issueTokenPair(prisma, user);
  
  return { user: sanitizeUser(user), tokens };
};

export const loginUser = async (payload: LoginPayload) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      timezone: true,
      passwordHash: true,
      streakFreezeCredits: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await comparePassword(payload.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const tokens = await issueTokenPair(prisma, user);
  return { user: sanitizeUser(user), tokens };
};

export const refreshSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          timezone: true,
          streakFreezeCredits: true,
          createdAt: true,
        },
      },
    },
  });

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    throw new AppError("Refresh token is invalid or expired", 401);
  }

  if (storedToken.userId !== payload.sub) {
    throw new AppError("Refresh token mismatch", 401);
  }

  const accessToken = signAccessToken({
    sub: storedToken.user.id,
    email: storedToken.user.email,
  });

  return {
    user: sanitizeUser(storedToken.user),
    tokens: { accessToken, refreshToken },
  };
};

export const logoutUser = async (refreshToken?: string) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
};

export const getCurrentUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      timezone: true,
      streakFreezeCredits: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
};
