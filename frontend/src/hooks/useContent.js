import { useEffect, useState } from 'react';
import api from '../lib/api';

// Global cache to avoid refetching
let cache = null;
let promise = null;

export function useContent() {
  const [content, setContent] = useState(cache || {});
  const [loaded, setLoaded] = useState(!!cache);

  useEffect(() => {
    if (cache) return;
    if (!promise) {
      promise = api.get('/public/content').then(({ data }) => {
        cache = data || {};
        return cache;
      }).catch(() => ({}));
    }
    promise.then((data) => { setContent(data); setLoaded(true); });
  }, []);

  const t = (key, fallback = '') => {
    const val = content[key];
    return (val !== undefined && val !== null && val !== '') ? val : fallback;
  };

  return { t, content, loaded };
}
