import { getRepository, respond } from "@/lib/data";
import { endpoints } from "@/lib/data/endpoints";

export function GET() {
  return respond(endpoints.categories(getRepository()));
}
