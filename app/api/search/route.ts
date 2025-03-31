import { NextResponse } from "next/server";
import axios from "axios";
import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBGenre {
  id: number;
  name: string;
}

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

interface QdrantResult {
  id: string;
  score: number;
  payload: MoviePayload;
  tmdb?: TMDBMovieDetails;
}

// Initialize text embedder
let textEmbedder: FeatureExtractionPipeline | null = null;

async function getTextEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!textEmbedder) {
    textEmbedder = (await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )) as FeatureExtractionPipeline;
  }
  return textEmbedder;
}

async function getTextEmbedding(text: string): Promise<number[]> {
  const embedder = await getTextEmbedder();
  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

async function getTMDBMovieDetails(
  title: string,
  year: number
): Promise<TMDBMovieDetails | null> {
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
        external_ids: {
          imdb_id: detailsResponse.data.external_ids?.imdb_id,
        },
        genres:
          detailsResponse.data.genres?.map((genre: TMDBGenre) => genre.name) ||
          [],
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

    // Prepare search parameters
    const searchParams = {
      vector: vector,
      limit: 20,
      with_payload: true,
      score_threshold: 0.0,
    };

    const response = await axios.post(
      `${QDRANT_URL}/collections/movie_plots/points/search`,
      searchParams,
      {
        headers: {
          "api-key": QDRANT_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Fetch additional details from TMDB for each movie
    const enhancedResults = await Promise.all(
      response.data.result.map(async (result: QdrantResult) => {
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
  } catch (error: unknown) {
    console.error(
      "Search error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to perform search",
      },
      { status: 500 }
    );
  }
}
