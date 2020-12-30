import React, { useEffect, useRef, useState } from 'react';
import {
  Redirect
} from 'react-router-dom';

export default function HomePage() {
  const [gifUrl, setGifUrl] = useState('');

  const [redirecting, setRedirecting] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(false);
  const gifUrlRef = useRef(null);

  useEffect(() => {
    // DEBUGGING PURPOSES - Set input to a short wipe-out gif
    setGifUrl('https://media.giphy.com/media/3o7aD0ILhi08LGF1PG/giphy.gif');
  }, []);

  function onUrlEntered() {
    setFetchLoading(true);
    setTimeout(() => {
      if (gifUrl.endsWith('.gif')) {
        setRedirecting(true);
      }
    }, 300);
  }

  return (
    <>
      {redirecting ? (
        console.log(`/editor?gifUrl=${gifUrl}`) || <Redirect to={`/editor?gifUrl=${gifUrl}`} />
      ) : (
          <div className="p-6 text-center">
            <h1 className="text-2xl">Enter gif url:</h1>
            <input
              ref={gifUrlRef}
              type="text"
              value={gifUrl}
              onChange={() => setGifUrl(gifUrlRef.current.value)}
              className="pt-2 pb-2 border-b-2 outline-none focus:border-blue-300 mr-3"
            />{' '}
            <button
              onClick={onUrlEntered}
              className={`${fetchLoading ? 'disabled:opacity-50 bg-gray-300' : 'bg-blue-300'} p-2.5 rounded`}
            >
              {fetchLoading
                ? <span>Loading <img alt="loading-spinner" className="inline h-3" src="spinner.gif" /></span>
                : <span>Enter</span>
              }
            </button>
          </div>
        )}
    </>
  );
}