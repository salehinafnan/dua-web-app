// Bilingual text. Both languages are rendered and CSS shows the one picked in
// settings; if a translation is missing we fall back to whichever exists.
export default function T({ en, bn, as: Tag = "span", className = "" }) {
  if (en && bn)
    return (
      <>
        <Tag lang="en" className={`i18n-en ${className}`}>
          {en}
        </Tag>
        <Tag lang="bn" className={`i18n-bn ${className}`}>
          {bn}
        </Tag>
      </>
    );
  const only = en || bn;
  return only ? (
    <Tag lang={en ? "en" : "bn"} className={className}>
      {only}
    </Tag>
  ) : null;
}

export const ui = {
  categories: { en: "Categories", bn: "ক্যাটাগরি" },
  searchCategories: { en: "Search categories", bn: "ক্যাটাগরি খুঁজুন" },
  searchDuas: { en: "Search duas", bn: "দোয়া খুঁজুন" },
  subcategories: { en: "Subcategories", bn: "সাব-ক্যাটাগরি" },
  duas: { en: "Duas", bn: "দোয়া" },
  section: { en: "Section", bn: "অধ্যায়" },
  transliteration: { en: "Transliteration", bn: "উচ্চারণ" },
  translation: { en: "Translation", bn: "অনুবাদ" },
  reference: { en: "Reference", bn: "রেফারেন্স" },
  settings: { en: "Settings", bn: "সেটিংস" },
  allDuas: { en: "All Duas", bn: "সকল দোয়া" },
  bookmarks: { en: "Bookmarks", bn: "বুকমার্ক" },
};
