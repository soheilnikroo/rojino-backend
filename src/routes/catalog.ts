import { Router } from "express";
import { digikalaCatalog } from "../providers/digikala/index.js";

export const catalogRouter: Router = Router();

catalogRouter.get("/catalog", async (req, res) => {
  const query = String(req.query.q ?? "رژ لب").trim() || "رژ لب";
  const page = Math.max(1, Number(req.query.page) || 1);

  try {
    res.json(await digikalaCatalog(query, page));
  } catch (error) {
    const message = error instanceof Error ? error.message : "catalog failed";
    console.error("catalog error:", message);
    res.json([]);
  }
});
