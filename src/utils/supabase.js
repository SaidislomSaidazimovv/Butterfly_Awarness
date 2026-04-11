// Supabase client and backend utility functions
import { createClient } from '@supabase/supabase-js';
import { track } from './track.js';

export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export function getCountryCode() {
  try {
    const lang = navigator.language || navigator.languages?.[0] || '';
    const parts = lang.split('-');
    if (parts.length > 1) return parts[parts.length - 1].toUpperCase();
    return null;
  } catch (error) {
    if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'getCountryCode', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    return null;
  }
}

export async function getLocationData() {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`);
    const data = await res.json();
    return { country: data.country || null, city: data.city || null };
  } catch (error) {
    if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'getLocationData', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    return { country: getCountryCode(), city: null };
  }
}

export async function saveHandRaise(userId, city) {
  try {
    const sessionId = localStorage.getItem('bc_session') || crypto.randomUUID();
    localStorage.setItem('bc_session', sessionId);
    if (userId) {
      const { data: existing } = await supabase.from('hand_raises').select('id').eq('user_id', userId).single();
      if (existing) return;
    } else {
      const { data: existing } = await supabase.from('hand_raises').select('id').eq('session_id', sessionId).single();
      if (existing) return;
    }
    await supabase.from('hand_raises').insert({
      session_id: sessionId,
      user_id: userId || null,
      country_code: getCountryCode(),
      city: city || null,
      referred_by: localStorage.getItem('bc_ref') || null
    });
  } catch (error) {
    if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'saveHandRaise', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
  }
}

export async function saveEmail(email) {
  try {
    const { error } = await supabase.from('email_reminders').insert({ email });
    if (error) {
      const msg = error.message || error.details || '';
      const code = error.code || '';
      if (code === '23505' || msg.includes('duplicate') || msg.includes('unique') || msg.includes('already exists') || msg.includes('conflict')) {
        return { success: false, message: "You're already subscribed!" };
      }
      return { success: false, message: 'Something went wrong.' };
    }
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ action: 'confirmation', email, secret: import.meta.env.VITE_FUNCTION_SECRET })
      });
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'sendConfirmationEmail', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
    return { success: true };
  } catch { return { success: false, message: 'Something went wrong.' }; }
}
