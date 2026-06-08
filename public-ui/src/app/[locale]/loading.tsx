/**
 * Skeleton shown by Next.js App Router while a page is loading.
 * Uses the skeleton-shimmer utility from globals.css.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-pearl">
      {/* Frozen header placeholder */}
      <div className="fixed inset-x-0 top-0 z-50 h-[64px] border-b border-champagne/15 bg-pearl/95 backdrop-blur-xl" />

      <main className="flex-1 pt-[64px]">
        {/* Hero dark placeholder */}
        <div className="relative flex min-h-[80vh] items-center overflow-hidden bg-deep-brown">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="space-y-5 lg:max-w-xl">
              <div className="skeleton-shimmer h-3 w-24 rounded-full" />
              <div
                className="skeleton-shimmer h-10 w-3/4 rounded-xl"
                style={{ animationDelay: "0.08s" }}
              />
              <div
                className="skeleton-shimmer h-10 w-1/2 rounded-xl"
                style={{ animationDelay: "0.14s" }}
              />
              <div
                className="skeleton-shimmer mt-3 h-4 w-4/5 rounded-full"
                style={{ animationDelay: "0.20s" }}
              />
              <div
                className="skeleton-shimmer h-4 w-3/5 rounded-full"
                style={{ animationDelay: "0.26s" }}
              />
              <div className="mt-6 flex gap-4">
                <div
                  className="skeleton-shimmer h-12 w-40 rounded-full"
                  style={{ animationDelay: "0.32s" }}
                />
                <div
                  className="skeleton-shimmer h-12 w-36 rounded-full"
                  style={{ animationDelay: "0.38s" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Below-fold shimmer */}
        <div className="mx-auto max-w-4xl space-y-4 px-6 py-16">
          {[88, 72, 90, 58, 76].map((w, i) => (
            <div
              key={i}
              className="skeleton-shimmer h-4 rounded-full"
              style={{ width: `${w}%`, animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
