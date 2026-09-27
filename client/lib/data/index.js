import "server-only";
import { openDatabase } from "./db";
import { CACHE_CONTROL } from "./endpoints";
import { createRepository } from "./repository";

let repository;

// One read-only connection per server process.
export function getRepository() {
  return (repository ??= createRepository(openDatabase()));
}

export function respond({ status, body }) {
  return Response.json(body, {
    status,
    headers: status === 200 ? { "Cache-Control": CACHE_CONTROL } : undefined,
  });
}
