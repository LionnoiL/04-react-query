import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../ReactPaginate/ReactPaginate";

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlerOnSubmit = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const {
    data: movies,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<FetchMoviesResponse>({
    queryKey: ["fetchMovies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = movies?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && movies.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, movies]);

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handlerOnSubmit}></SearchBar>

      {isSuccess && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {isSuccess && movies.results.length > 0 ? (
        <MovieGrid movies={movies.results} onSelect={setSelectedMovie} />
      ) : null}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
