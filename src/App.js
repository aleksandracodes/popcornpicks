import { useCallback, useState } from 'react';
import { NumResults } from './utils/NumResults';
import { Loader } from './utils/Loader';
import { Box } from './utils/Box';
import { ErrorMessage } from './utils/ErrorMessage';
import { NavBar } from './components/NavBar';
import { Search } from './components/Search';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { MovieList } from './components/MovieList';
import { MovieDetails } from './components/MovieDetails';
import { WatchedSummary } from './components/WatchedSummary';
import { WatchedMovieList } from './components/WatchedMovieList';
import { Message } from './utils/Message';

export const apiKey = process.env.REACT_APP_KEY_API;

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Main({ children }) {
  return <main className="main">{children}</main>;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem('watched');
  //   return JSON.parse(storedValue);
  // });

  const handleCloseMovie = useCallback(() => setSelectedId(null), []);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], 'watched');

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {!movies.length && !error && !isLoading && (
            <Message>
              Find a movie by typing its title in the search box above🎬
            </Message>
          )}

          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />

              {!watched.length ? (
                <Message>
                  You haven't watched any movies yet. Start watching...🍿
                </Message>
              ) : (
                <WatchedMovieList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                />
              )}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
