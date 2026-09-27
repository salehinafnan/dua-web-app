import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";

// The dataset lives with the web app (client/data) so the Next.js deployment
// is self-contained; this API reads the same file.
export const DEFAULT_DB_PATH = fileURLToPath(
  new URL("../../client/data/dua_main.sqlite", import.meta.url),
);

export function openDatabase(path = process.env.DB_PATH || DEFAULT_DB_PATH) {
  return new Database(path, { readonly: true, fileMustExist: true });
}
