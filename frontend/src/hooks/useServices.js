import { useEffect, useState } from 'react';
import api from '../lib/api';

// Cache for the services list
let listCache = null;
let listPromise = null;

export function useServices() {
  const [services, setServices] = useState(listCache || []);
  const [loaded, setLoaded] = useState(!!listCache);

  useEffect(() => {
    if (listCache) return;
    if (!listPromise) {
      listPromise = api.get('/public/services').then(({ data }) => {
        listCache = data || [];
        return listCache;
      }).catch(() => []);
    }
    listPromise.then((data) => { setServices(data); setLoaded(true); });
  }, []);

  return { services, loaded };
}

export function useService(slug) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api.get(`/public/services/${slug}`)
      .then(({ data }) => setService(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return { service, loading, notFound };
}

// Reset cache (used after admin edits if needed)
export function invalidateServicesCache() {
  listCache = null;
  listPromise = null;
}
