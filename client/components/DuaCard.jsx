import DuaActions from "./DuaActions";
import T, { ui } from "./T";
import { DuaBadge } from "./icons";

function copyTextFor(dua, lang) {
  const pick = (v) => v?.[lang] || v?.en || v?.bn;
  return [
    pick(dua.title),
    ...dua.passages.flatMap((p) => [
      p.arabic,
      pick(p.transliteration),
      pick(p.translation),
      pick(p.reference) && `${ui.reference[lang]}: ${pick(p.reference)}`,
    ]),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function Arabic({ passage }) {
  const cls = "arabic text-right";
  if (!passage.arabic) return null;
  if (!passage.indopak)
    return (
      <p dir="rtl" lang="ar" className={cls}>
        {passage.arabic}
      </p>
    );
  return (
    <>
      <p dir="rtl" lang="ar" className={`${cls} script-uthmani`}>
        {passage.arabic}
      </p>
      <p dir="rtl" lang="ar" className={`${cls} script-indopak`}>
        {passage.indopak}
      </p>
    </>
  );
}

function Labeled({ label, value, className = "", italic = false }) {
  if (!value?.en && !value?.bn) return null;
  return (
    <p className={`reading leading-relaxed ${className}`}>
      <span className="font-semibold">
        <T {...label} />:{" "}
      </span>
      <T {...value} className={italic ? "italic" : ""} />
    </p>
  );
}

export default function DuaCard({ dua, n }) {
  return (
    <article
      id={`dua-${dua.id}`}
      className="scroll-mt-6 space-y-6 rounded-xl border border-line bg-surface px-6 pt-5 pb-4 target:ring-2 target:ring-brand"
    >
      <header className="flex items-center gap-3">
        <DuaBadge n={n} />
        <h3 className="leading-snug font-semibold text-brand">
          <T {...dua.title} />
        </h3>
      </header>

      {(dua.intro.en || dua.intro.bn) && (
        <T
          {...dua.intro}
          as="p"
          className="reading leading-relaxed whitespace-pre-line"
        />
      )}

      {dua.passages.map((p, i) => (
        <div key={i} className="space-y-4">
          <Arabic passage={p} />
          <Labeled
            label={ui.transliteration}
            value={p.transliteration}
            className="transliteration"
            italic
          />
          <Labeled
            label={ui.translation}
            value={p.translation}
            className="translation"
          />
          {(p.reference.en || p.reference.bn) && (
            <div className="reading">
              <p className="font-semibold text-brand">
                <T {...ui.reference} />:
              </p>
              <T {...p.reference} as="p" className="font-medium" />
            </div>
          )}
        </div>
      ))}

      {(dua.note.en || dua.note.bn) && (
        <T
          {...dua.note}
          as="p"
          className="reading leading-relaxed whitespace-pre-line text-ink-soft"
        />
      )}

      <DuaActions
        id={dua.id}
        categoryId={dua.categoryId}
        title={dua.title.en || dua.title.bn}
        audio={dua.audio}
        copyText={{ en: copyTextFor(dua, "en"), bn: copyTextFor(dua, "bn") }}
      />
    </article>
  );
}
