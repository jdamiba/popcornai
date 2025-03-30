"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
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
          (result: any) => result.tmdb?.poster_path && result.tmdb?.overview
        )
        .reduce((unique: any[], result: any) => {
          const title = result.payload.title.toLowerCase();
          if (
            !unique.some((item) => item.payload.title.toLowerCase() === title)
          ) {
            unique.push(result);
          }
          return unique;
        }, []);

      setResults(filteredResults);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(
        err.message ||
          "An error occurred while searching for movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log(results);

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Movie Plot Similarity Search</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="mb-4">
          <label htmlFor="query" className="block text-sm font-medium mb-2">
            Enter your search query:
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-black w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any text to find similar movies..."
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Find Similar Movies"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Similar Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative h-[300px] w-full">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${result.tmdb.poster_path}`}
                    alt={result.payload.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl text-black font-medium">
                      {result.payload.title || "Untitled Movie"}
                    </h3>
                    {result.tmdb?.imdb_id && (
                      <a
                        href={`https://www.imdb.com/title/${result.tmdb.imdb_id}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        IMDB
                      </a>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Director: {result.payload.director}</p>
                    <p>Release Year: {result.payload.release_year}</p>
                    {result.tmdb?.vote_average && (
                      <p>
                        Rating: {result.tmdb.vote_average.toFixed(1)}/10 (
                        {result.tmdb.vote_count} votes)
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex-grow">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {result.tmdb.overview}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-sm text-blue-600">
                      Similarity Score: {(result.score * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !loading && !error && query.trim() ? (
        <div className="text-gray-500 text-center py-4">
          No similar movies found. Try a different search query.
        </div>
      ) : null}
    </main>
  );
}
