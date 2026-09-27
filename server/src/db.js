import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";

export const DEFAULT_DB_PATH = fileURLToPath(
  new URL("../database/dua_main.sqlite", import.meta.url),
);

export function openDatabase(path = process.env.DB_PATH || DEFAULT_DB_PATH) {
  return new Database(path, { readonly: true, fileMustExist: true });
}
