import { Router } from "express";
import { catalogRouter } from "./catalog.js";
import { facetsRouter } from "./facets.js";
import { healthRouter } from "./health.js";
import { rawRouter } from "./raw.js";
import { searchRouter } from "./search.js";

export function createRouter(): Router {
  const router = Router();

  router.use(healthRouter);
  router.use(searchRouter);
  router.use(catalogRouter);
  router.use(facetsRouter);
  router.use(rawRouter);

  return router;
}
