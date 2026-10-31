import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const apiKey = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<FetchMoviesResponse> => {
  const config = {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const response = await axios.get<FetchMoviesResponse>(BASE_URL, config);

  return response.data;
};
