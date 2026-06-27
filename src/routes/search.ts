import { Router } from "express";
import { config } from "../config.js";
import { digikalaSearch } from "../providers/digikala/index.js";
import { mockSearch } from "../providers/mock.js";
import { torobSearch } from "../providers/torob.js";

export const searchRouter: Router = Router();

searchRouter.get("/search", async (req, res) => {
  const query = String(req.query.q ?? "").trim();
  if (!query) {
    res.json([]);
    return;
  }

  try {
    let items =
      config.PROVIDER === "digikala"
        ? await digikalaSearch(query)
        : config.PROVIDER === "torob"
          ? await torobSearch(query)
          : mockSearch(query);

    if (!items.length) items = mockSearch(query);
    res.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "search failed";
    console.error("search error:", message);
    res.json(mockSearch(query));
  }
});
