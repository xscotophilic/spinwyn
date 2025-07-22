export function ShimmerOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 rounded-md overflow-hidden pointer-events-none">
      <div className="shimmer w-full h-full" />
    </div>
  );
}
