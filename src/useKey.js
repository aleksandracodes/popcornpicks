import { useEffect } from 'react';

export function useKey(key, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      document.addEventListener('keydown', callback);

      // remove the old event listener
      // each time that the component unmounts or it re-renders
      return function () {
        document.removeEventListener('keydown', callback);
      };
    },
    [key, action]
  );
}
