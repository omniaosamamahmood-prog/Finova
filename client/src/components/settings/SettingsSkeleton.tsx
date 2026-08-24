function SettingsSkeleton() {
  return (
    <div className="grid min-w-0 gap-5" aria-hidden="true">
      <div className="ui-card animate-pulse p-5 sm:p-6 lg:p-8">
        <div className="h-6 w-24 rounded bg-surface-hover" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:gap-8">
          <div className="flex flex-col items-center rounded-2xl border border-border-subtle bg-bg p-6">
            <div className="size-24 rounded-full bg-surface-hover sm:size-28" />
            <div className="mt-3 h-4 w-28 rounded bg-surface-hover" />
            <div className="mt-4 h-11 w-full rounded-xl bg-surface-hover" />
            <div className="mt-2 h-11 w-full rounded-xl bg-surface-hover" />
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-surface-hover" />
              <div className="h-12 w-full rounded-xl bg-surface-hover" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-surface-hover" />
              <div className="h-12 w-full rounded-xl bg-surface-hover" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <div className="h-4 w-28 rounded bg-surface-hover" />
              <div className="h-12 w-full rounded-xl bg-surface-hover" />
            </div>
            <div className="flex sm:col-span-2 sm:justify-end">
              <div className="h-11 w-full rounded-xl bg-surface-hover sm:w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSkeleton;
