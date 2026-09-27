import { getRepository, respond } from "@/lib/data";
import { endpoints } from "@/lib/data/endpoints";

export function GET(request) {
  const q = new URL(request.url).searchParams.get("q");
  return respond(endpoints.search(getRepository(), { q }));
}
