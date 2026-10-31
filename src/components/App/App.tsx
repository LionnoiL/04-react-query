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

const App = () => {
  const [query, setQuery] = useState<string>("");
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handlerOnSubmit = (query: string) => {
    setQuery(query);
  };

  const {
    data: movies,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["fetchMovies", query],
    queryFn: () => fetchMovies(query),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess]);

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handlerOnSubmit}></SearchBar>
      {isSuccess && movies.length > 0 ? (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
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
