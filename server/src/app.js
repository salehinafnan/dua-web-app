import express from "express";
import cors from "cors";
import { createRepository } from "./repository.js";

const positiveInt = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export function createApp(db, { corsOrigin = "*" } = {}) {
  const repo = createRepository(db);
  const app = express();
  const api = express.Router();

  app.disable("x-powered-by");
  app.use(cors({ origin: corsOrigin }));

  // Content is read-only, so let browsers and proxies cache it.
  api.use((req, res, next) => {
    res.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=3600",
    );
    next();
  });

  api.get("/categories", (req, res) => res.json(repo.listCategories()));

  api.get("/categories/:id", (req, res) => {
    const id = positiveInt(req.params.id);
    const category = id && repo.getCategory(id);
    if (!category) return res.status(404).json({ error: "category not found" });
    res.json(category);
  });

  api.get("/duas", (req, res) => {
    const ids = String(req.query.ids ?? "")
      .split(",")
      .map(positiveInt)
      .filter(Boolean)
      .slice(0, 100);
    if (ids.length === 0)
      return res
        .status(400)
        .json({ error: "`ids` must be a comma-separated list of dua ids" });
    res.json(repo.getDuas(ids));
  });

  api.get("/duas/:id", (req, res) => {
    const id = positiveInt(req.params.id);
    const dua = id && repo.getDua(id);
    if (!dua) return res.status(404).json({ error: "dua not found" });
    res.json(dua);
  });

  api.get("/search", (req, res) => {
    const term = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (term.length < 2)
      return res
        .status(400)
        .json({ error: "`q` must be at least 2 characters" });
    res.json(repo.search(term.slice(0, 100)));
  });

  app.use("/api", api);
  app.get("/health", (req, res) => res.json({ ok: true }));
  app.use((req, res) => res.status(404).json({ error: "not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  });

  return app;
}
