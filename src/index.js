import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';

import StarRating from './StarRating';

function Test() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StarRating color="green" maxRating={10} onSetRating={setMovieRating} />
      <p>
        This movie was rated {movieRating} {movieRating > 1 ? 'stars' : 'star'}
      </p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={5} />
    <StarRating
      maxRating={5}
      color="blue"
      className="test"
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
      defaultRating={4}
    />

    <Test />
  </React.StrictMode>
);
