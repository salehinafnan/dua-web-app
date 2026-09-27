import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/db.js";

let server;
let base;
const db = openDatabase();

before(async () => {
  server = createApp(db).listen(0, "127.0.0.1");
  await once(server, "listening");
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => {
  server.close();
  db.close();
});

const get = async (path) => {
  const res = await fetch(base + path);
  return { status: res.status, body: await res.json(), headers: res.headers };
};

describe("GET /api/categories", () => {
  it("returns all ten categories with their subcategories", async () => {
    const { status, body, headers } = await get("/api/categories");
    assert.equal(status, 200);
    assert.equal(body.length, 10);
    assert.deepEqual(body[0].name, {
      en: "Dua's Importance",
      bn: "দোয়ার গুরুত্ব",
    });
    assert.equal(body[0].subcategories.length, 7);
    assert.match(headers.get("cache-control"), /max-age/);
  });

  it("counts duas from the data instead of trusting stored totals", async () => {
    const { body } = await get("/api/categories");
    const morning = body.find((c) => c.id === 5);
    const total = morning.subcategories.reduce((n, s) => n + s.duaCount, 0);
    assert.equal(morning.duaCount, total);
  });
});

describe("GET /api/categories/:id", () => {
  it("nests duas under their subcategories", async () => {
    const { status, body } = await get("/api/categories/1");
    assert.equal(status, 200);
    const [first] = body.subcategories;
    assert.equal(first.name.en, "The servant is dependent on his Lord");
    assert.equal(first.duas.length, first.duaCount);
    assert.equal(first.duas[1].passages[0].reference.en, "Bukhari: 844");
  });

  it("404s for unknown or malformed ids", async () => {
    assert.equal((await get("/api/categories/99")).status, 404);
    assert.equal((await get("/api/categories/abc")).status, 404);
  });
});

describe("GET /api/duas", () => {
  it("folds multi-row duas into one dua with several passages", async () => {
    const { body } = await get("/api/duas/123");
    assert.equal(body.title.en, "Tasbeeh");
    assert.deepEqual(
      body.passages.map((p) => p.transliteration.en),
      [
        "Sub’hanallah",
        "Al’hamdu lillah",
        "Allahu Akbaar",
        body.passages[3].transliteration.en,
        "Laa ilahaa illAllah",
      ],
    );
  });

  it("fetches several duas by id, skipping unknown ones", async () => {
    const { body } = await get("/api/duas?ids=2,9999,3");
    assert.deepEqual(
      body.map((d) => d.id),
      [2, 3],
    );
  });

  it("validates ids", async () => {
    assert.equal((await get("/api/duas?ids=")).status, 400);
    assert.equal((await get("/api/duas/0")).status, 404);
  });
});

describe("GET /api/search", () => {
  it("ranks title matches first", async () => {
    const { body } = await get("/api/search?q=sleep");
    assert.match(body[0].title.en, /sleep/i);
    assert.ok(body[0].category.en);
  });

  it("matches Bangla regardless of Unicode composition", async () => {
    const precomposed = "\u09a6\u09cb\u09df\u09be"; // দোয়া with U+09DF
    const decomposed = precomposed.normalize("NFD");
    const [a, b] = await Promise.all(
      [precomposed, decomposed].map((q) =>
        get(`/api/search?q=${encodeURIComponent(q)}`),
      ),
    );
    assert.ok(a.body.length > 0);
    assert.deepEqual(
      a.body.map((d) => d.id),
      b.body.map((d) => d.id),
    );
  });

  it("searches Bangla and treats LIKE wildcards literally", async () => {
    assert.ok(
      (await get(`/api/search?q=${encodeURIComponent("ঘুম")}`)).body.length > 0,
    );
    assert.equal((await get("/api/search?q=%25%25")).body.length, 0);
  });

  it("requires at least two characters", async () => {
    assert.equal((await get("/api/search?q=a")).status, 400);
  });
});

it("returns JSON 404 for unknown routes", async () => {
  const { status, body } = await get("/nope");
  assert.equal(status, 404);
  assert.deepEqual(body, { error: "not found" });
});
