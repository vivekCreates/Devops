import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { login, logout, me, refresh, register } from "./auth.controller.js";
import { loginSchema, logoutSchema, registerSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), register);
authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);
