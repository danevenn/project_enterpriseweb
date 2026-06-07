import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-12 w-2/3 max-w-xl" />
      <Skeleton className="mt-3 h-6 w-1/2 max-w-md" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full" />
        ))}
      </div>
    </div>
  );
}
