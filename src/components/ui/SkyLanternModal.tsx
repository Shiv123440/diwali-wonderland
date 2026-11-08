import React, { useState } from 'react';
import { Send, Sparkles, X, Flame } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface SkyLanternModalProps {
  onRelease: (wish: string, sender: string, count: number) => void;
  onClose: () => void;
  lanternsCount: number;
}

export const SkyLanternModal: React.FC<SkyLanternModalProps> = ({
  onRelease,
  onClose,
  lanternsCount,
}) => {
  const [sender, setSender] = useState('');
  const [wish, setWish] = useState('Peace, Joy & Prosperity for All');
  const [lanternCount, setLanternCount] = useState<number>(1);

  const presetWishes = [
    'Peace, Joy & Prosperity for All',
    'Good Health & Boundless Happiness',
    'Abundance, Wealth & Good Fortune',
    'Victory of Light over Darkness',
    'Success & New Beginnings',
  ];

  const countOptions = [
    { count: 1, label: '1 Solo Lantern' },
    { count: 3, label: '3 Lanterns Trio' },
    { count: 5, label: '5 Lanterns Flock' },
    { count: 8, label: '8 Royal Flight' },
  ];

  const handleRelease = (countToRelease?: number) => {
    const finalCount = countToRelease || lanternCount;
    audioManager.playLanternRelease();
    onRelease(
      wish.trim() || 'Happy Diwali',
      sender.trim() || 'A Diwali Well-wisher',
      finalCount
    );
    onClose();
  };

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-40 max-w-sm w-full glass-panel p-5 rounded-2xl border border-amber-400/40 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
            <Send className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
              FLOATING SKY LANTERNS
            </h2>
            <p className="text-[10px] text-amber-400/70">
              Lanterns Soaring in Heavens: {lanternsCount}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-amber-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-neutral-300 mb-3">
        Write your sacred blessing or heartfelt intention into traditional Akash Deep lanterns and release them singly or in glowing flocks into the starlit heavens.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRelease();
        }}
        className="space-y-3"
      >
        <div>
          <label className="text-[11px] font-cinzel text-amber-300 block mb-1">
            CHOOSE FLOCK QUANTITY:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {countOptions.map((opt) => (
              <button
                key={opt.count}
                type="button"
                onClick={() => setLanternCount(opt.count)}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-cinzel border transition-all flex items-center justify-center gap-1.5 ${
                  lanternCount === opt.count
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold shadow-sm'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:border-amber-400/30'
                }`}
              >
                <Flame className={`w-3 h-3 ${lanternCount === opt.count ? 'text-amber-300' : 'text-neutral-500'}`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-cinzel text-amber-300 block mb-1">
            SELECT INSPIRATION:
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
            {presetWishes.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setWish(p)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all text-left ${
                  wish === p
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-semibold'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:border-amber-400/30'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-cinzel text-amber-300 block mb-1">
            YOUR PRAYER / WISH:
          </label>
          <textarea
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950/60 border border-amber-400/30 text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            placeholder="Type your personal Diwali wish..."
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-cinzel text-amber-300 block mb-1">
            YOUR NAME (OPTIONAL):
          </label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950/60 border border-amber-400/30 text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            placeholder="e.g. Aarav, Priya, The Sharma Family"
          />
        </div>

        <div className="pt-1 flex flex-col gap-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-diya-glow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {lanternCount === 1 ? 'RELEASE 1 LANTERN TO SKY' : `RELEASE ${lanternCount} LANTERNS FLOCK`}
          </button>

          {lanternCount === 1 && (
            <button
              type="button"
              onClick={() => handleRelease(5)}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-200 font-cinzel font-semibold text-[11px] tracking-wide flex items-center justify-center gap-1.5 hover:bg-amber-500/20 transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              Quick Release: 5 Lanterns Constellation
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
