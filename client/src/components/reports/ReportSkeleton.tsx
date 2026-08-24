function PulseBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-surface-hover ${className}`} />;
}

function ReportSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-border bg-surface"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="ui-card p-5 sm:p-6">
          <PulseBlock className="h-9 w-48" />
          <PulseBlock className="mt-6 h-64 w-full" />
        </div>
        <div className="ui-card p-5 sm:p-6">
          <PulseBlock className="h-9 w-52" />
          <div className="mt-6 space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between gap-3">
                  <PulseBlock className="h-4 w-24 rounded" />
                  <PulseBlock className="h-4 w-20 rounded" />
                </div>
                <PulseBlock className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportSkeleton;
