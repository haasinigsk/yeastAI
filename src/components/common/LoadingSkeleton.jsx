export default function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{ width: `${100 - i * 15 - Math.random() * 10}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-2 w-16" />
        </div>
      </div>
      <div className="skeleton h-8 w-20" />
      <div className="skeleton h-2 w-full" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-4 w-20" />
      </div>
      <div className="h-64 flex items-end gap-2 px-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="flex-1 skeleton rounded-t-md"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}
