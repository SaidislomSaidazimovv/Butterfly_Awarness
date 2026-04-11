import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase.js';
import { SEED } from '../data/index.js';
import { rLL, uid } from '../utils/helpers.js';

export function useLiveHands() {
  const [e, sE] = useState(SEED);
  const add = useCallback(({ country, city }) => { const [lat, lng] = rLL(country, city); sE(p => [{ id: uid(), country, city: city || "", lat, lng, createdAt: Date.now() }, ...p]); }, []);
  useEffect(() => {
    supabase
      .from('hand_raises')
      .select('city, country_code, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const dbEntries = data.map(r => {
          const [lat, lng] = rLL(r.country_code || 'US', r.city || '');
          return { id: uid(), country: r.country_code || 'US', city: r.city || '', lat, lng, createdAt: new Date(r.created_at).getTime() };
        });
        sE(prev => [...dbEntries, ...prev]);
      });
  }, []);
  return { entries: e, addEntry: add };
}
