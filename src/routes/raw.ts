import { Router } from "express";
import { config, encodeQuery, USER_AGENT } from "../config.js";

export const rawRouter: Router = Router();

rawRouter.get("/raw", async (req, res) => {
  const query = String(req.query.q ?? "").trim();
  const provider = String(req.query.provider ?? config.PROVIDER);

  try {
    const url =
      provider === "torob"
        ? `https://api.torob.com/v4/base-product/search/?query=${encodeQuery(query)}&page=0`
        : `https://api.digikala.com/v1/search/?q=${encodeQuery(query)}&page=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    const text = await response.text();
    res.type("application/json").send(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : "raw fetch failed";
    res.status(502).json({ error: message });
  }
});
