export function Movie({ movie, onSelectMovie }) {
  console.log('movie.Poster', movie.Poster);

  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.id}>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'popcorn-image.png'}
        alt={`${movie.Title}`}
      />

      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
