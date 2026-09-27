// Request handling shared by the Next.js route handlers (app/api) and the
// standalone Express API (server/): validate input, query the repository,
// return { status, body }.

const positiveInt = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const ok = (body) => ({ status: 200, body });
const fail = (status, error) => ({ status, body: { error } });

// The dataset only changes when the app is redeployed.
export const CACHE_CONTROL =
  "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

export const endpoints = {
  categories: (repo) => ok(repo.listCategories()),

  category(repo, { id }) {
    const n = positiveInt(id);
    const category = n && repo.getCategory(n);
    return category ? ok(category) : fail(404, "category not found");
  },

  duas(repo, { ids }) {
    const list = String(ids ?? "")
      .split(",")
      .map(positiveInt)
      .filter(Boolean)
      .slice(0, 100);
    return list.length
      ? ok(repo.getDuas(list))
      : fail(400, "`ids` must be a comma-separated list of dua ids");
  },

  dua(repo, { id }) {
    const n = positiveInt(id);
    const dua = n && repo.getDua(n);
    return dua ? ok(dua) : fail(404, "dua not found");
  },

  search(repo, { q }) {
    const term = typeof q === "string" ? q.trim() : "";
    return term.length < 2
      ? fail(400, "`q` must be at least 2 characters")
      : ok(repo.search(term.slice(0, 100)));
  },
};
