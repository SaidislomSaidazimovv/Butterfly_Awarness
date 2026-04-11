import { useState, useEffect, useCallback } from 'react';

export function usePathRouter() {
  const [page, setPage] = useState(() => {
    const path = window.location.pathname.replace(/^\//, '');
    return path || '';
  });
  useEffect(() => {
    const handler = () => {
      const path = window.location.pathname.replace(/^\//, '');
      setPage(path || '');
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);
  const navigate = useCallback((p) => {
    window.history.pushState({}, '', p ? '/' + p : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);
  return { page, navigate };
}
