import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-16 px-8 bg-white dark:bg-black">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">
              Movie Platform
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Upload, watch, and discover movies. Create your personal watchlist and explore content with AI-powered recommendations.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50">Upload Movies</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Upload movies via URL and share them with the community
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50">Watch & Stream</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Stream movies directly in your browser with our built-in player
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50">Discover</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Search movies by title, genre, or get AI-powered recommendations
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/movies"
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white font-medium transition-colors hover:bg-blue-700"
            >
              Browse Movies
            </Link>
            <Link
              href="/movies"
              className="flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-solid border-gray-300 px-8 transition-colors hover:border-transparent hover:bg-gray-100 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              Upload Movie
            </Link>
          </div>

          {/* Stats */}
          <div className="pt-16 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Free</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Always Free</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">HD</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Quality Streaming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">AI</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Smart Recommendations</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
