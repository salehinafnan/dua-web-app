export default function Loading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading duas">
      <div className="h-14 animate-pulse rounded-xl bg-surface" />
      {[0, 1].map((i) => (
        <div key={i} className="h-72 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}
