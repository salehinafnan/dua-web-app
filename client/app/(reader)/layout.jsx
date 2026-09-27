import { connection } from "next/server";
import AppShell from "@/components/AppShell";
import { getCategories } from "@/lib/api";

export default async function ReaderLayout({ children }) {
  await connection(); // data comes from the API at request time, not at build
  const categories = await getCategories();
  return <AppShell categories={categories}>{children}</AppShell>;
}
