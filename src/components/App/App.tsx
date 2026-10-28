import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { useEffect, useState } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handlerOnSubmit = (query: string) => {
    setQuery(query);
  };

  useEffect(() => {
    const getMovies = async () => {
      if (!query) {
        return;
      }

      setMovies([]);
      setHasError(false);
      setIsLoading(true);
      try {
        const findedMovies = await fetchMovies(query);
        setMovies(findedMovies);
        if (findedMovies.length === 0) {
          toast("No movies found for your request.");
        }
      } catch (error) {
        console.error(error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, [query]);

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handlerOnSubmit}></SearchBar>
      {movies.length > 0 ? (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      ) : null}
      {hasError && <ErrorMessage />}
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
