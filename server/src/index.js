import { createApp } from "./app.js";
import { openDatabase } from "./db.js";

const port = Number(process.env.PORT) || 4000;
const db = openDatabase();
const server = createApp(db, {
  corsOrigin: process.env.CORS_ORIGIN?.split(",") ?? "*",
}).listen(port, () => {
  console.log(`Dua API listening on http://localhost:${port}/api`);
});

for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => server.close(() => db.close()));
