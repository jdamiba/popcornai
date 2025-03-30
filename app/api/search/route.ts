import { NextResponse } from "next/server";
import axios from "axios";
import { pipeline } from "@xenova/transformers";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Initialize text embedder
let textEmbedder: any = null;

async function getTextEmbedder() {
  if (!textEmbedder) {
    textEmbedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return textEmbedder;
}

async function getTextEmbedding(text: string) {
  const embedder = await getTextEmbedder();
  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

async function getTMDBMovieDetails(title: string, year: number) {
  try {
    // Search for the movie
    const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        year: year,
      },
    });

    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const movieId = searchResponse.data.results[0].id;

      // Get detailed movie information
      const detailsResponse = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}`,
        {
          params: {
            api_key: TMDB_API_KEY,
            append_to_response: "credits,external_ids",
          },
        }
      );

      return {
        poster_path: detailsResponse.data.poster_path,
        overview: detailsResponse.data.overview,
        vote_average: detailsResponse.data.vote_average,
        vote_count: detailsResponse.data.vote_count,
        release_date: detailsResponse.data.release_date,
        imdb_id: detailsResponse.data.external_ids?.imdb_id,
      };
    }
    return null;
  } catch (error) {
    console.error("TMDB API error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Get text embedding
    const vector = await getTextEmbedding(query);

    const response = await axios.post(
      `${QDRANT_URL}/collections/movie_plots/points/search`,
      {
        vector,
        limit: 50,
        with_payload: true,
      },
      {
        headers: {
          "api-key": QDRANT_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Fetch additional details from TMDB for each movie
    const enhancedResults = await Promise.all(
      response.data.result.map(async (result: any) => {
        const tmdbDetails = await getTMDBMovieDetails(
          result.payload.title,
          result.payload.release_year
        );
        return {
          ...result,
          tmdb: tmdbDetails,
        };
      })
    );

    return NextResponse.json({
      ...response.data,
      result: enhancedResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
