export interface LocalMovie {
  id: string;
  title: string;
  imagePath: string;
}

// Local movie posters from public/movies directory
export const localMovies: LocalMovie[] = [
  {
    id: "1",
    title: "Interstellar",
    imagePath: "/movies/interstellar-139400_500x749.webp",
  },
  {
    id: "2",
    title: "Deadpool & Wolverine",
    imagePath:
      "/movies/deadpool-wolverine_866a70e7-fb48-4f35-a44b-41594691ac76_500x749.webp",
  },
  {
    id: "3",
    title: "The Dark Knight",
    imagePath:
      "/movies/darkknight.building.24x36_20e90057-f673-4cc3-9ce7-7b0d3eeb7d83_500x749.webp",
  },
  {
    id: "4",
    title: "Back to the Future",
    imagePath: "/movies/backtofuture.mpw_500x749.webp",
  },
  {
    id: "5",
    title: "Avengers",
    imagePath: "/movies/avengers.24x36_500x749.webp",
  },
  {
    id: "6",
    title: "Alien",
    imagePath: "/movies/Alien.mpw.114883_500x749.webp",
  },
];

// Get a subset of movies for the hero section
export function getHeroMovies(): LocalMovie[] {
  return localMovies.slice(0, 5);
}
