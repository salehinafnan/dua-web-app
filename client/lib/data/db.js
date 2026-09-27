import Database from "better-sqlite3";
import path from "node:path";

// Resolved from the project root so it also works inside a serverless bundle
// (the file is shipped via outputFileTracingIncludes in next.config.mjs).
export const DB_PATH = path.join(process.cwd(), "data", "dua_main.sqlite");

export function openDatabase(file = process.env.DB_PATH || DB_PATH) {
  return new Database(file, { readonly: true, fileMustExist: true });
}
