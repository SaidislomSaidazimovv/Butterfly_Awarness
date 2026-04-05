import React from 'react';
import { Globe, MapPin, Award, ArrowRight } from 'lucide-react';

const COLORS = {
  text: '#111111',
  muted: '#4D4D4D',
  caption: '#6E6E73',
  accent: '#00b18d',
  warm: '#E8A838',
  bg: '#FFFFFF',
};

interface LeaderboardItem {
  rank: number;
  flag: string;
  name: string;
  count: number;
}

interface TopParticipant {
  name: string;
  avatar: string | null;
  count: number;
}

interface LeaderboardSectionProps {
  countryLeaderboard: LeaderboardItem[];
  cityLeaderboard: LeaderboardItem[];
  topParticipants: TopParticipant[];
  showParticipants: boolean;
  visible: boolean;
  leaderboardTab: 'country' | 'city';
  onTabChange: (tab: 'country' | 'city') => void;
  formatNumber: (n: number) => string;
}

export const LeaderboardSection = React.memo(function LeaderboardSection({
  countryLeaderboard,
  cityLeaderboard,
  topParticipants,
  showParticipants,
  visible,
  leaderboardTab,
  onTabChange,
  formatNumber,
}: LeaderboardSectionProps) {
  return (
    <>
      <div className={`text-center mb-12 flex flex-col items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-4xl md:text-[48px] xl:text-[56px] 2xl:text-[64px] font-bold mb-4" style={{ color: COLORS.text, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          The wave, live.
        </h2>
        <p className="text-lg md:text-xl" style={{ color: COLORS.muted }}>
          See where the Butterfly Challenge is spreading.
        </p>
      </div>

      {/* Leaderboard tabs (mobile) */}
      <div className="md:hidden flex rounded-xl p-1 mb-6" style={{ backgroundColor: '#f5f5f7' }}>
        <button
          onClick={() => onTabChange('country')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${leaderboardTab === 'country' ? 'bg-white shadow-sm' : ''}`}
          style={{ color: leaderboardTab === 'country' ? COLORS.text : COLORS.muted }}
        >
          Countries
        </button>
        <button
          onClick={() => onTabChange('city')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${leaderboardTab === 'city' ? 'bg-white shadow-sm' : ''}`}
          style={{ color: leaderboardTab === 'city' ? COLORS.text : COLORS.muted }}
        >
          Cities
        </button>
      </div>

      {/* Leaderboards */}
      <div className={`grid grid-cols-1 gap-4 ${showParticipants ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-2xl mx-auto'}`}>
        {/* Country leaderboard */}
        <div
          className={`rounded-[2rem] p-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ backgroundColor: '#f5f5f7' }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
            <Globe className="w-5 h-5" style={{ color: COLORS.accent }} />
            Top Countries
          </h3>
          <div className="space-y-3">
            {countryLeaderboard.map((item) => (
              <div key={item.name} className="flex items-center gap-3 py-2">
                <span className="w-6 text-sm font-bold" style={{ color: COLORS.caption }}>{item.rank}</span>
                <span className="text-xl">{item.flag}</span>
                <span className="flex-1 text-sm font-medium" style={{ color: COLORS.text }}>{item.name}</span>
                <span className="text-sm font-semibold" style={{ color: COLORS.accent }}>{formatNumber(item.count)}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.accent }}>
            See all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* City leaderboard */}
        <div
          className={`rounded-[2rem] p-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ backgroundColor: '#f5f5f7', transitionDelay: '100ms' }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
            <MapPin className="w-5 h-5" style={{ color: COLORS.warm }} />
            Top Cities
          </h3>
          <div className="space-y-3">
            {cityLeaderboard.map((item) => (
              <div key={item.name} className="flex items-center gap-3 py-2">
                <span className="w-6 text-sm font-bold" style={{ color: COLORS.caption }}>{item.rank}</span>
                <span className="flex-1 text-sm font-medium" style={{ color: COLORS.text }}>{item.name}</span>
                <span className="text-sm font-semibold" style={{ color: COLORS.warm }}>{formatNumber(item.count)}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.accent }}>
            See all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Participants */}
        {showParticipants && (
          <div
            className={`rounded-[2rem] p-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ backgroundColor: '#f5f5f7', transitionDelay: '200ms' }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.text }}>
              <Award className="w-5 h-5" style={{ color: COLORS.accent }} />
              Top Participants
            </h3>
            <div className="space-y-3">
              {topParticipants.length > 0 ? topParticipants.map((p, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <span className="w-6 text-sm font-bold" style={{ color: COLORS.caption }}>{i + 1}</span>
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: COLORS.accent }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 text-sm font-medium" style={{ color: COLORS.text }}>{p.name}</span>
                  <span className="text-sm font-semibold" style={{ color: COLORS.accent }}>
                    {p.count} share{p.count > 1 ? 's' : ''}
                  </span>
                </div>
              )) : (
                <p className="text-sm py-4 text-center" style={{ color: COLORS.caption }}>
                  Be the first to share! 🦋
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm mt-6" style={{ color: COLORS.caption }}>
        📸 Screenshot & share your city's rank!
      </p>
    </>
  );
});
