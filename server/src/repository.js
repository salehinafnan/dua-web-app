// Maps the raw SQLite rows onto a clean API shape.
//
// Some duas are stored as several consecutive rows that share the same `id`
// (e.g. "Tasbeeh" = SubhanAllah / Alhamdulillah / Allahu Akbar). Only the
// first row carries the title and intro text; the rest are extra passages. We
// fold them into a single dua with a `passages` array.

// The Bangla text mixes precomposed and decomposed forms of the same letters
// (e.g. U+09DF vs U+09AF U+09BC), so normalise everything we emit or compare.
const text = (v) =>
  typeof v === "string" && v.trim() ? v.trim().normalize("NFC") : null;

const bilingual = (row, field) => ({
  en: text(row[`${field}_en`]),
  bn: text(row[`${field}_bn`]),
});

const passageOf = (row) => ({
  arabic: text(row.dua_arabic),
  indopak: text(row.dua_indopak),
  transliteration: bilingual(row, "transliteration"),
  translation: bilingual(row, "translation"),
  reference: bilingual(row, "refference"),
});

const hasContent = (p) =>
  p.arabic || p.transliteration.en || p.translation.en || p.translation.bn;

function groupDuas(rows) {
  const duas = [];
  const byId = new Map();
  for (const row of rows) {
    let dua = byId.get(row.id);
    if (!dua) {
      dua = {
        id: row.id,
        categoryId: row.cat_id,
        subcategoryId: row.subcat_id,
        title: bilingual(row, "dua_name"),
        intro: bilingual(row, "top"),
        passages: [],
        note: bilingual(row, "bottom"),
        audio: text(row.audio),
      };
      byId.set(row.id, dua);
      duas.push(dua);
    }
    const passage = passageOf(row);
    if (hasContent(passage) || passage.reference.en || passage.reference.bn)
      dua.passages.push(passage);
  }
  return duas;
}

export function createRepository(db) {
  db.function("nfc", { deterministic: true }, (v) =>
    typeof v === "string" ? v.normalize("NFC") : v,
  );
  const q = {
    categories: db.prepare(`
      SELECT c.cat_id, c.cat_name_en, c.cat_name_bn, c.cat_icon,
             (SELECT COUNT(*) FROM sub_category s WHERE s.cat_id = c.cat_id) AS subcategories,
             (SELECT COUNT(DISTINCT d.id) FROM dua d WHERE d.cat_id = c.cat_id) AS duas
      FROM category c ORDER BY c.cat_id`),
    subcategories: db.prepare(`
      SELECT s.cat_id, s.subcat_id, s.subcat_name_en, s.subcat_name_bn,
             (SELECT COUNT(DISTINCT d.id) FROM dua d WHERE d.subcat_id = s.subcat_id) AS duas
      FROM sub_category s ORDER BY s.subcat_id`),
    duasInCategory: db.prepare(
      "SELECT * FROM dua WHERE cat_id = ? ORDER BY rowid",
    ),
    duaById: db.prepare("SELECT * FROM dua WHERE id = ? ORDER BY rowid"),
    search: db.prepare(`
      SELECT id FROM dua
      WHERE nfc(dua_name_en) LIKE @q ESCAPE '\\' OR nfc(dua_name_bn) LIKE @q ESCAPE '\\'
         OR nfc(translation_en) LIKE @q ESCAPE '\\' OR nfc(translation_bn) LIKE @q ESCAPE '\\'
         OR nfc(transliteration_en) LIKE @q ESCAPE '\\' OR nfc(top_en) LIKE @q ESCAPE '\\' OR nfc(top_bn) LIKE @q ESCAPE '\\'
         OR nfc(clean_arabic) LIKE @q ESCAPE '\\' OR nfc(refference_en) LIKE @q ESCAPE '\\'
      GROUP BY id
      -- title matches first, then everything else in reading order
      ORDER BY MIN(CASE WHEN nfc(dua_name_en) LIKE @q ESCAPE '\\'
                          OR nfc(dua_name_bn) LIKE @q ESCAPE '\\' THEN 0 ELSE 1 END),
               MIN(rowid)
      LIMIT @limit`),
  };

  // The dataset is static, so derive the navigation tree once.
  const subcategories = q.subcategories.all().map((s) => ({
    id: s.subcat_id,
    categoryId: s.cat_id,
    name: { en: text(s.subcat_name_en), bn: text(s.subcat_name_bn) },
    duaCount: s.duas,
  }));
  const categories = q.categories.all().map((c) => ({
    id: c.cat_id,
    name: { en: text(c.cat_name_en), bn: text(c.cat_name_bn) },
    icon: c.cat_icon,
    subcategoryCount: c.subcategories,
    duaCount: c.duas,
    subcategories: subcategories.filter((s) => s.categoryId === c.cat_id),
  }));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const getDua = (id) => groupDuas(q.duaById.all(id))[0] ?? null;

  return {
    listCategories: () => categories,

    getCategory(id) {
      const category = categoryById.get(id);
      if (!category) return null;
      const duas = groupDuas(q.duasInCategory.all(id));
      return {
        ...category,
        subcategories: category.subcategories.map((s) => ({
          ...s,
          duas: duas.filter((d) => d.subcategoryId === s.id),
        })),
      };
    },

    getDua,

    getDuas: (ids) => ids.map(getDua).filter(Boolean),

    search(term, limit = 20) {
      const escaped = term.normalize("NFC").replace(/[\\%_]/g, (c) => `\\${c}`);
      return q.search
        .all({ q: `%${escaped}%`, limit })
        .map((r) => getDua(r.id))
        .map((d) => ({ ...d, category: categoryById.get(d.categoryId)?.name }));
    },
  };
}
