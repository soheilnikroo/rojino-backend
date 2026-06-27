import express, { type Express } from "express";
import { createRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();
  app.use(createRouter());
  return app;
}
