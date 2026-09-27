// Server-side data access. Pages call these from Server Components; the
// browser uses the same API through the /api rewrite in next.config.mjs.
const API_URL = process.env.API_URL ?? "http://localhost:4000";

export class ApiUnavailableError extends Error {}

async function get(path) {
  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, { next: { revalidate: 300 } });
  } catch (cause) {
    throw new ApiUnavailableError(`Could not reach the API at ${API_URL}`, {
      cause,
    });
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`);
  return res.json();
}

export const getCategories = () => get("/categories");
export const getCategory = (id) => get(`/categories/${encodeURIComponent(id)}`);
