import { Router } from "express";
import { config } from "../config.js";

export const healthRouter: Router = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({ ok: true, provider: config.PROVIDER });
});
