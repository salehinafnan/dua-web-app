import { getRepository, respond } from "@/lib/data";
import { endpoints } from "@/lib/data/endpoints";

export async function GET(request, { params }) {
  return respond(endpoints.category(getRepository(), await params));
}
