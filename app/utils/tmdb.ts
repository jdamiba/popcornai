const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface MoviePoster {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
}

// Popular movies with good visuals for our hero section
const HERO_MOVIE_IDS = [
  299534, // Avengers: Endgame
  238, // The Godfather
  278, // The Shawshank Redemption
  550, // Fight Club
  27205, // Inception
];

export async function getHeroMovies(): Promise<MoviePoster[]> {
  try {
    const movies = await Promise.all(
      HERO_MOVIE_IDS.map(async (id) => {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch movie ${id}`);
        }
        return response.json();
      })
    );
    return movies;
  } catch (error) {
    console.error("Error fetching hero movies:", error);
    return [];
  }
}

export function getPosterUrl(
  posterPath: string,
  size: "w500" | "original" = "w500"
): string {
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

export function getBackdropUrl(
  backdropPath: string,
  size: "w1280" | "original" = "w1280"
): string {
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
}
