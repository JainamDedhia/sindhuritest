export default function ProductCardSkeleton() {
  return (
    <div className="relative rounded-3xl bg-white overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-200">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="px-4 pb-4 pt-3 space-y-3">
        {/* Title */}
        <div className="h-4 w-3/4 rounded bg-neutral-200 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        {/* Subtitle */}
        <div className="h-3 w-1/2 rounded bg-neutral-200 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        {/* Price & Stock */}
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-neutral-200 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-3 w-16 rounded bg-neutral-200 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 rounded-xl bg-neutral-200 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-10 flex-1 rounded-xl bg-neutral-200 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
