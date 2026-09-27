import { notFound } from "next/navigation";
import DuaCard from "@/components/DuaCard";
import ScrollToHash from "@/components/ScrollToHash";
import T, { ui } from "@/components/T";
import { getCategory } from "@/lib/api";

export async function generateMetadata({ params }) {
  const { categoryId } = await params;
  const category = await getCategory(categoryId);
  return { title: category ? category.name.en : "Category not found" };
}

export default async function CategoryPage({ params }) {
  const { categoryId } = await params;
  const category = await getCategory(categoryId);
  if (!category) notFound();

  let n = 0;
  return (
    <div className="space-y-8">
      {category.subcategories.map((s) => (
        <section
          key={s.id}
          id={`subcategory-${s.id}`}
          data-subcategory={s.id}
          className="scroll-mt-6 space-y-3"
        >
          <h2 className="rounded-xl border border-line bg-surface px-6 py-4 leading-relaxed">
            <span className="font-semibold text-brand">
              <T {...ui.section} />:
            </span>{" "}
            <T {...s.name} className="font-medium" />
          </h2>
          {s.duas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} n={++n} />
          ))}
        </section>
      ))}
      <ScrollToHash />
    </div>
  );
}
