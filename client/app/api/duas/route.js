import { getRepository, respond } from "@/lib/data";
import { endpoints } from "@/lib/data/endpoints";

export function GET(request) {
  const ids = new URL(request.url).searchParams.get("ids");
  return respond(endpoints.duas(getRepository(), { ids }));
}
