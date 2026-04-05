import React from 'react';
import { Play } from 'lucide-react';
import handImg2 from '../hand2.webp';

const COLORS = {
  text: '#111111',
  muted: '#4D4D4D',
  accent: '#00b18d',
  danger: '#FF3B30',
  success: '#32C189',
};

interface HeroSectionProps {
  visible: boolean;
  counter: number;
  showPlusOne: boolean;
  formatNumber: (n: number) => string;
  onLearnMore: () => void;
  onWatchTutorial: () => void;
}

export const HeroSection = React.memo(function HeroSection({
  visible,
  counter,
  showPlusOne,
  formatNumber,
  onLearnMore,
  onWatchTutorial,
}: HeroSectionProps) {
  return (
    <>
      {/* Content */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto text-center flex flex-col items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p
          className="text-sm md:text-base font-semibold uppercase tracking-widest mb-4"
          style={{ color: COLORS.muted }}
        >
          Butterfly Month · May 2026
        </p>

        <h1
          className="text-5xl md:text-7xl xl:text-8xl 2xl:text-9xl font-semibold mb-2 leading-tight"
          style={{ color: COLORS.text, letterSpacing: '-0.02em' }}
        >
          Butterfly Challenge
        </h1>

        <p
          className="text-lg md:text-[28px] font-normal mb-8"
          style={{ color: COLORS.text, lineHeight: '1.2' }}
        >
          60 seconds. 3 names. 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLearnMore}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm md:text-[17px] font-normal text-white transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.accent }}
          >
            Learn more
          </button>
          <button
            onClick={onWatchTutorial}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm md:text-[17px] font-normal border border-[#00b18d] text-[#00b18d] transition-all hover:bg-[#00b18d] hover:text-white"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch the Tutorial
          </button>
        </div>
      </div>

      {/* Hero Image & Counter */}
      <div
        className={`relative w-[95%] sm:w-[60%] lg:w-[35%] mx-auto flex flex-col items-center transition-all duration-1000 delay-300 mt-12 ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
      >
        <img
          src={handImg2}
          alt="Hands raised in support"
          className="w-full h-auto object-contain"
        />

        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center drop-shadow-lg">
          <div
            className="flex items-center gap-3 mb-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-sm"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${formatNumber(counter)} hands raised worldwide`}
          >
            <span className="text-xs md:text-sm font-semibold text-gray-900">
              {formatNumber(counter)} hands raised
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: COLORS.danger }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: COLORS.danger }}></span>
            </span>
          </div>
          {showPlusOne && (
            <span className="animate-float-up font-bold text-sm" style={{ color: COLORS.success }}>
              +1
            </span>
          )}
        </div>
      </div>
    </>
  );
});
