import { useState, useRef, useCallback } from 'react';

export function useToast() { const [t, sT] = useState(null); const r = useRef(); const show = useCallback(m => { clearTimeout(r.current); sT(m); r.current = setTimeout(() => sT(null), 2e3); }, []); return { toast: t, show }; }
