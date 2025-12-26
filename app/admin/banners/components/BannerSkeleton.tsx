export default function BannerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 rounded-xl" />
      ))}
    </div>
  );
}
