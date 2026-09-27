import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto mt-24 max-w-md space-y-4 p-8 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="text-xl font-semibold">This page doesn’t exist</h1>
      <Link
        href="/duas/1"
        className="inline-block rounded-lg bg-brand px-5 py-2 font-medium text-white"
      >
        Back to duas
      </Link>
    </div>
  );
}
