function TransactionSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="ui-card animate-pulse p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-surface-hover" />
              <div className="h-3 w-24 rounded bg-surface-hover" />
            </div>
            <div className="h-4 w-20 rounded bg-surface-hover" />
          </div>
          <div className="mt-4 flex justify-between">
            <div className="h-6 w-28 rounded bg-surface-hover" />
            <div className="h-8 w-32 rounded bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionSkeleton;
