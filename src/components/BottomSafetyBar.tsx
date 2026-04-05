import React from 'react';
import { Heart, ExternalLink, Phone } from 'lucide-react';

const COLORS = {
  accent: '#00b18d',
  muted: '#4D4D4D',
  caption: '#6E6E73',
  hair: '#E5E5EA',
  surface: '#F5F5F7',
};

interface BottomSafetyBarProps {
  onSafeExit: () => void;
  onCrisisOpen: () => void;
}

export const BottomSafetyBar = React.memo(function BottomSafetyBar({ onSafeExit, onCrisisOpen }: BottomSafetyBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-t bg-white"
      style={{ borderColor: COLORS.hair, height: '48px' }}
    >
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4" style={{ color: COLORS.accent }} />
        <span className="text-xs font-medium" style={{ color: COLORS.muted }}>
          Need help? You're not alone.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSafeExit}
          className="sm:hidden p-1.5 rounded-full"
          style={{ backgroundColor: COLORS.surface }}
          aria-label="Safe exit"
        >
          <ExternalLink className="w-4 h-4" style={{ color: COLORS.caption }} />
        </button>

        <button
          onClick={onCrisisOpen}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: COLORS.accent }}
        >
          <Phone className="w-3 h-3" />
          <span>988</span>
        </button>
      </div>
    </div>
  );
});
