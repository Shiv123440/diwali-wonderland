import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, RotateCcw } from 'lucide-react';
import { DiyaIllustration } from './common/DiyaIllustration';
import { sound } from '../services/audioEngine';

interface DiyaItem {
  id: number;
  name: string;
  blessing: string;
  isLit: boolean;
}

const INITIAL_DIYAS: DiyaItem[] = [
  { id: 1, name: 'Jyoti', blessing: 'Inner Light & Clarity', isLit: true },
  { id: 2, name: 'Vidya', blessing: 'Wisdom & Knowledge', isLit: false },
  { id: 3, name: 'Samriddhi', blessing: 'Wealth & Abundance', isLit: false },
  { id: 4, name: 'Shanti', blessing: 'Peace & Serenity', isLit: true },
  { id: 5, name: 'Arogya', blessing: 'Health & Vitality', isLit: false },
  { id: 6, name: 'Sauharda', blessing: 'Harmony & Love', isLit: false },
  { id: 7, name: 'Ananda', blessing: 'Boundless Joy', isLit: false },
];

interface DiyaCeremonyProps {
  onLightProgress?: (litCount: number, total: number) => void;
}

export const DiyaCeremony: React.FC<DiyaCeremonyProps> = ({ onLightProgress }) => {
  const [diyas, setDiyas] = useState<DiyaItem[]>(INITIAL_DIYAS);
  const [showGrandBlessing, setShowGrandBlessing] = useState<boolean>(false);

  const litCount = diyas.filter((d) => d.isLit).length;
  const allLit = litCount === diyas.length;

  const toggleDiya = (id: number) => {
    sound.playDiyaLight();

    setDiyas((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, isLit: true } : d));
      const newLitCount = updated.filter((d) => d.isLit).length;

      if (onLightProgress) {
        onLightProgress(newLitCount, updated.length);
      }

      if (newLitCount === updated.length && !allLit) {
        setTimeout(() => {
          setShowGrandBlessing(true);
          sound.playGiftOpen();
        }, 500);
      }

      return updated;
    });
  };

  const handleLightAll = () => {
    sound.playGiftOpen();
    const updated = diyas.map((d) => ({ ...d, isLit: true }));
    setDiyas(updated);
    if (onLightProgress) onLightProgress(updated.length, updated.length);
    setTimeout(() => setShowGrandBlessing(true), 400);
  };

  const handleReset = () => {
    sound.playClick();
    const reset = diyas.map((d, i) => ({ ...d, isLit: i === 0 }));
    setDiyas(reset);
    setShowGrandBlessing(false);
    if (onLightProgress) onLightProgress(1, reset.length);
  };

  return (
    <div className="relative w-full h-full min-h-[85vh] flex flex-col items-center justify-between px-4 py-8 select-none z-20">
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 60%, rgba(245, 158, 11, ${0.08 + (litCount / diyas.length) * 0.28}) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-30 flex flex-col items-center text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md mb-3">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
            Sacred Deepotsav Ceremony
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 drop-shadow-[0_2px_10px_rgba(243,180,63,0.3)]">
          Light the Seven Sacred Diyas
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mt-1 max-w-md">
          Click on any unlit diya to ignite its ceremonial flame and invite radiant blessings into your home.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="w-48 sm:w-64 h-2 rounded-full bg-slate-800/80 border border-amber-500/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500 rounded-full"
              style={{ width: `${(litCount / diyas.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-amber-300 tracking-wider">
            {litCount} / {diyas.length} Lit
          </span>
        </div>
      </div>

      <div className="relative w-full max-w-4xl py-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 z-30">
        {diyas.map((diya, index) => (
          <motion.div
            key={diya.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => toggleDiya(diya.id)}
          >
            <div className="relative transition-transform duration-300 group-hover:scale-110 active:scale-95">
              <DiyaIllustration
                isLit={diya.isLit}
                size="md"
                showMandalaBase={diya.isLit}
              />

              {diya.isLit && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shadow-md">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <h4 className="text-xs sm:text-sm font-semibold text-amber-200 tracking-wider">
                {diya.name}
              </h4>
              <p className="text-[10px] sm:text-xs text-amber-300/60 font-light italic">
                {diya.blessing}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-30 flex items-center gap-4">
        {!allLit ? (
          <button
            onClick={handleLightAll}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Light All Diyas</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-400/40 text-amber-200 font-medium text-xs sm:text-sm tracking-wide transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Relight Deepotsav</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showGrandBlessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg p-8 rounded-3xl bg-gradient-to-b from-[#161233] to-[#0a0d24] border border-amber-400/40 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-center space-y-5"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Maha Deepotsav Complete
                </span>
                <h3 className="text-3xl font-serif font-bold text-amber-50">
                  All Seven Sacred Diyas Are Burning Bright
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-100 font-serif italic text-sm sm:text-base leading-relaxed">
                "ॐ असतो मा सद्गमय ।<br />
                तमसो मा ज्योतिर्गमय ।<br />
                मृत्योर्मा अमृतं गमय ॥"
                <p className="text-xs not-italic text-amber-300/70 mt-2 font-sans font-light">
                  "From falsehood lead us to truth, from darkness lead us to light, from mortality lead us to life eternal."
                </p>
              </div>

              <button
                onClick={() => setShowGrandBlessing(false)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-lg hover:scale-102 active:scale-98 transition-all"
              >
                Accept the Divine Light
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
