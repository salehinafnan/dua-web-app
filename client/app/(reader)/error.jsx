"use client";

export default function ReaderError({ reset }) {
  return (
    <div className="mx-auto mt-24 max-w-lg space-y-4 rounded-2xl border border-line bg-surface p-8 text-center">
      <h1 className="text-xl font-semibold">Couldn’t load the duas</h1>
      <p className="text-muted">
        The API didn’t respond. If you’re running locally, start it with{" "}
        <code className="rounded bg-surface-muted px-1.5 py-0.5">
          cd server &amp;&amp; npm start
        </code>{" "}
        and make sure{" "}
        <code className="rounded bg-surface-muted px-1.5 py-0.5">API_URL</code>{" "}
        points to it.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-brand px-5 py-2 font-medium text-white hover:bg-brand-strong"
      >
        Try again
      </button>
    </div>
  );
}
