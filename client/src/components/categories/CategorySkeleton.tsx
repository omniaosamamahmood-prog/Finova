function CategorySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="ui-card animate-pulse p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="h-4 w-28 rounded bg-surface-hover" />
            <div className="h-6 w-16 rounded bg-surface-hover" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <div className="h-8 w-20 rounded bg-surface-hover" />
            <div className="h-8 w-20 rounded bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategorySkeleton;
