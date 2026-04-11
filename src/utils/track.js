// Mixpanel analytics wrapper
import mixpanel from 'mixpanel-browser';

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  debug: false,
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
  api_host: 'https://api-eu.mixpanel.com'
});

export function track(event, props) {
  try { mixpanel.track(event, props || {}); } catch(e) {}
}

export { mixpanel };
