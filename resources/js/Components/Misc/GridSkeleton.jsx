const GridSkeleton = ({ count = 6, cardWidth = '300px', className }) => {
  return (
    <div
      className={`grid gap-4 p-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}, 1fr))`,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white overflow-hidden rounded-lg p-2 shadow-md dark:bg-gray-800"
        >
          {/* obrázek  */}
          <div className="h-48 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />

          <div className="mt-4 space-y-3">
            {/*  titulek */}
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

            {/* popis */}
            <div className="space-y-2">
              <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* tagy */}
            <div className="flex gap-2">
              <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridSkeleton;
