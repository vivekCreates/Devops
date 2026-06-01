import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/http-response.js";
import {
  getCurrentUserProfile,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from "./auth.service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await registerUser(req.body);
  sendSuccess(res, 201, data, "Account created successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await loginUser(req.body);
  sendSuccess(res, 200, data, "Login successful");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const data = await refreshSession(req.body.refreshToken);
  sendSuccess(res, 200, data, "Session refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutUser(req.body.refreshToken);
  sendSuccess(res, 200, null, "Logged out");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const data = await getCurrentUserProfile(req.user!.id);
  sendSuccess(res, 200, data);
});
