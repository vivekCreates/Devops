import { z } from "zod";
import { isValidTimeZone } from "../../utils/date.js";

const timezoneSchema = z
  .string()
  .refine((value) => isValidTimeZone(value), "Invalid IANA timezone")
  .optional();

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(80),
    email: z.string().trim().email(),
    password: z.string().min(8).max(120),
    timezone: timezoneSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(8).max(120),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const refreshSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const logoutSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
