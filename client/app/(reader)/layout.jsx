import AppShell from "@/components/AppShell";
import { getRepository } from "@/lib/data";

export default function ReaderLayout({ children }) {
  return (
    <AppShell categories={getRepository().listCategories()}>
      {children}
    </AppShell>
  );
}
