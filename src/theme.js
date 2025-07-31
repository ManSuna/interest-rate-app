import { useState, useEffect } from 'react';

export const useMetadata = () => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('metadata');

    if (stored) {
      setMetadata(JSON.parse(stored));
      setLoading(false);
    } else {
      fetch('/api/metadata')
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('metadata', JSON.stringify(data));
          setMetadata(data);
        })
        .catch((err) => console.error('Failed to fetch metadata', err))
        .finally(() => setLoading(false));
    }
  }, []);

  return { metadata, loading };
};

import { useMetadata } from './useMetadata';

const Landing = () => {
  const { metadata, loading } = useMetadata();

  if (loading) return <p>Loading...</p>;

  return <p>Welcome to {metadata.systemName}</p>;
};
