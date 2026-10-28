import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const apiKey = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const config = {
    params: { query },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const response = await axios.get<FetchMoviesResponse>(BASE_URL, config);

  return response.data.results;
};
