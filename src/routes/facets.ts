import { Router } from "express";
import { digikalaFacets } from "../providers/digikala/index.js";
import type { Facets } from "../types/catalog.js";

const EMPTY_FACETS: Facets = {
  brands: [],
  colors: [],
  specs: [],
  longevity: [],
};

export const facetsRouter: Router = Router();

facetsRouter.get("/facets", async (req, res) => {
  const query = String(req.query.q ?? "رژ لب").trim() || "رژ لب";

  try {
    res.json(await digikalaFacets(query));
  } catch (error) {
    const message = error instanceof Error ? error.message : "facets failed";
    console.error("facets error:", message);
    res.json(EMPTY_FACETS);
  }
});
