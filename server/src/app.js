import express from "express";
import cors from "cors";
import { CACHE_CONTROL, endpoints } from "../../client/lib/data/endpoints.js";
import { createRepository } from "../../client/lib/data/repository.js";

// Standalone REST API over the same data layer the Next.js app uses.
export function createApp(db, { corsOrigin = "*" } = {}) {
  const repo = createRepository(db);
  const app = express();
  const api = express.Router();
  const send = (res, { status, body }) => {
    if (status === 200) res.set("Cache-Control", CACHE_CONTROL);
    res.status(status).json(body);
  };

  app.disable("x-powered-by");
  app.use(cors({ origin: corsOrigin }));

  api.get("/categories", (req, res) => send(res, endpoints.categories(repo)));
  api.get("/categories/:id", (req, res) =>
    send(res, endpoints.category(repo, req.params)),
  );
  api.get("/duas", (req, res) => send(res, endpoints.duas(repo, req.query)));
  api.get("/duas/:id", (req, res) =>
    send(res, endpoints.dua(repo, req.params)),
  );
  api.get("/search", (req, res) =>
    send(res, endpoints.search(repo, req.query)),
  );

  app.use("/api", api);
  app.get("/health", (req, res) => res.json({ ok: true }));
  app.use((req, res) => res.status(404).json({ error: "not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  });

  return app;
}
