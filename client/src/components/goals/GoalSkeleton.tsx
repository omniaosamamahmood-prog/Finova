function GoalSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="ui-card animate-pulse p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="h-4 w-28 rounded bg-surface-hover" />
            <div className="h-4 w-12 rounded bg-surface-hover" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-surface-hover" />
            <div className="h-10 rounded bg-surface-hover" />
            <div className="h-10 rounded bg-surface-hover" />
          </div>
          <div className="mt-3 h-4 w-36 rounded bg-surface-hover" />
          <div className="mt-4 h-2.5 rounded-full bg-surface-hover" />
          <div className="mt-4 flex justify-end gap-2">
            <div className="h-8 w-20 rounded bg-surface-hover" />
            <div className="h-8 w-20 rounded bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default GoalSkeleton;
