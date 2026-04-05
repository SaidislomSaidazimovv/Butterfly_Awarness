import React from 'react';
import { MessageCircle, Share2, X, Play } from 'lucide-react';
import logo from '../Butterfly_Challenge_logo_main (1).svg';

const COLORS = {
  text: '#111111',
  muted: '#4D4D4D',
  caption: '#6E6E73',
  hair: '#E5E5EA',
  accent: '#00b18d',
  surface: '#F5F5F7',
};

interface FooterSectionProps {
  onCrisisOpen: () => void;
}

export const FooterSection = React.memo(function FooterSection({ onCrisisOpen }: FooterSectionProps) {
  return (
    <footer id="footer" className="py-12 px-5" style={{ backgroundColor: COLORS.surface }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="mb-5 inline-block">
              <img src={logo} alt="Butterfly Challenge" className="h-7 w-auto opacity-90" loading="lazy" />
            </div>
            <p className="text-sm mb-4" style={{ color: COLORS.muted, lineHeight: '24px' }}>
              An initiative of One Humanity Foundation.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <MessageCircle className="w-5 h-5" />, label: 'Instagram' },
                { icon: <Share2 className="w-5 h-5" />, label: 'TikTok' },
                { icon: <X className="w-5 h-5" />, label: 'X' },
                { icon: <Play className="w-5 h-5" />, label: 'YouTube' }
              ].map((social, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white"
                  style={{ color: COLORS.muted }}
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: COLORS.text }}>Resources</h4>
            <ul className="space-y-3">
              {['How It Works', 'Learn the Gesture', 'Share Toolkit', 'FAQ'].map((link, i) => (
                <li key={i}>
                  <button className="text-sm transition-colors hover:text-blue-600" style={{ color: COLORS.muted }}>{link}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: COLORS.text }}>For Organizations</h4>
            <ul className="space-y-3">
              {['For Schools', 'For Teams', 'For Brands', 'Ambassador Program'].map((link, i) => (
                <li key={i}>
                  <button className="text-sm transition-colors hover:text-blue-600" style={{ color: COLORS.muted }}>{link}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: COLORS.text }}>Need Help?</h4>
            <div className="p-4 rounded-xl bg-white border" style={{ borderColor: COLORS.hair }}>
              <p className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>US: Call or Text 988</p>
              <p className="text-xs mb-3" style={{ color: COLORS.muted }}>24/7 free and confidential support.</p>
              <button
                onClick={onCrisisOpen}
                className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: COLORS.accent }}
              >
                Get Support Now
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-px mb-8" style={{ backgroundColor: COLORS.hair }} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {['Privacy', 'Terms', 'Accessibility', 'About'].map((link, i) => (
              <button key={i} className="text-xs transition-colors hover:text-blue-600" style={{ color: COLORS.caption }}>{link}</button>
            ))}
          </div>
          <p className="text-xs text-center md:text-right max-w-md" style={{ color: COLORS.caption }}>
            The Butterfly Challenge is a social gesture, not a replacement for professional care.
            If someone you know is in danger, call 911 or your local emergency number.
          </p>
        </div>

        <p className="text-xs text-center mt-8" style={{ color: COLORS.caption }}>
          © 2026 One Humanity Foundation. All rights reserved.
        </p>
      </div>
    </footer>
  );
});
