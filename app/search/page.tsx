"use client";

import { useState } from "react";
import Image from "next/image";

interface TMDBMovieDetails {
  poster_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  external_ids?: {
    imdb_id?: string;
  };
  genres?: string[];
}

interface MoviePayload {
  title: string;
  director: string;
  release_year: number;
  plot: string;
}

interface SearchResult {
  id: string;
  score: number;
  payload: MoviePayload;
  tmdb?: TMDBMovieDetails;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]); // Clear previous results

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data = await response.json();

      if (!data.result || !Array.isArray(data.result)) {
        throw new Error("Invalid response format");
      }

      // Filter results to only include those with both poster and overview
      // and remove duplicates based on title
      const filteredResults = data.result
        .filter(
          (result: SearchResult) =>
            result.tmdb?.poster_path && result.tmdb?.overview
        )
        .reduce((unique: SearchResult[], result: SearchResult) => {
          const title = result.payload.title.toLowerCase();
          if (
            !unique.some((item) => item.payload.title.toLowerCase() === title)
          ) {
            unique.push(result);
          }
          return unique;
        }, []);

      setResults(filteredResults);
    } catch (err: unknown) {
      console.error("Search error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching for movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Find Movies Based on Your Resume
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Paste your resume below and discover movies that match your
          professional journey
        </p>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="mb-6">
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Resume
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Copy and paste your resume text here to find movies that match your professional journey..."
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing Your Resume...
              </span>
            ) : (
              "Find Similar Movies"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {results.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Recommended Movies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-[400px] w-full">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${result.tmdb?.poster_path}`}
                      alt={result.payload.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        {result.payload.title || "Untitled Movie"}
                      </h3>
                      {result.tmdb?.external_ids?.imdb_id && (
                        <a
                          href={`https://www.imdb.com/title/${result.tmdb.external_ids.imdb_id}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                            </svg>
                            IMDB
                          </span>
                        </a>
                      )}
                    </div>
                    <div className="space-y-3 text-sm text-gray-300">
                      <p className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        {result.payload.director}
                      </p>
                      <p className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        {result.payload.release_year}
                      </p>
                      {result.tmdb?.genres && result.tmdb.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {result.tmdb.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                      {result.tmdb?.vote_average && (
                        <p className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                          {result.tmdb.vote_average.toFixed(1)}/10 (
                          {result.tmdb.vote_count} votes)
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {result.tmdb?.overview}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Match Score
                        </span>
                        <span className="text-sm font-semibold text-blue-400">
                          {(result.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading && !error && query.trim() ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No Movies Found</h3>
              <p className="text-gray-400">
                Try adjusting your resume text or try a different search.
                We&apos;re looking for the perfect match!
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
