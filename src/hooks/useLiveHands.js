import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.js';
import { SEED } from '../data/index.js';
import { SYNTHETIC_ENTRIES } from '../data/syntheticHands.js';
import { rLL, uid } from '../utils/helpers.js';

const INITIAL = [...SEED, ...SYNTHETIC_ENTRIES].sort((a, b) => b.createdAt - a.createdAt);

const rowToEntry = (r) => {
  const [lat, lng] = rLL(r.country_code || 'US', r.city || '');
  return {
    id: uid(),
    country: r.country_code || 'US',
    city: r.city || '',
    lat, lng,
    createdAt: new Date(r.created_at).getTime(),
  };
};

export function useLiveHands() {
  const [e, sE] = useState(INITIAL);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from('hand_raises')
      .select('city, country_code, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (cancelled || !data || data.length === 0) return;
        const dbEntries = data.map(rowToEntry);
        sE(prev => [...dbEntries, ...prev].sort((a, b) => b.createdAt - a.createdAt));
      });

    // Real-time: new hand_raises rows get prepended to the feed live
    const channel = supabase
      .channel('hand_raises_feed')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hand_raises' },
        (payload) => {
          if (cancelled || !payload.new) return;
          sE(prev => [rowToEntry(payload.new), ...prev]);
        }
      ).subscribe();

    return () => {
      cancelled = true;
      channel.unsubscribe();
    };
  }, []);
  return { entries: e };
}
