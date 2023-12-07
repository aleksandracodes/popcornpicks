import { useEffect, useRef, useState } from 'react';
import StarRating from '../utils/StarRating';
import { apiKey } from '../App';
import { Loader } from '../utils/Loader';
import { useKey } from '../hooks/useKey';
import { ErrorMessage } from '../utils/ErrorMessage';

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState('');

  const countRef = useRef(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // Destructure the movie object and overwrite default params names
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    imdbVotes,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const genreList =
    genre &&
    genre
      .split(',')
      .map((genreItem, _) => <li key={genre.id}>{genreItem.trim()}</li>);

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
          );

          if (!res.ok)
            throw new Error('Something went wrong with fetching movie details');

          const data = await res.json();
          console.log('data:', data);
          if (data.Response === 'False')
            throw new Error('Movie details not found');

          setMovie(data);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `PopcornPicks | ${title}`;

      return function () {
        document.title = 'PopcornPicks';
      };
    },
    [title]
  );

  useKey('Escape', onCloseMovie);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details fade-in">
      {error ? (
        <ErrorMessage message={error} />
      ) : isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <ul className="genre-list">{genreList}</ul>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating ({imdbVotes} votes)
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to favourites
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>

            <p>{plot}</p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
