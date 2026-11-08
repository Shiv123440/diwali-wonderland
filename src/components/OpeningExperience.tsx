import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Volume2 } from 'lucide-react';
import { DiyaIllustration } from './common/DiyaIllustration';
import { sound } from '../services/audioEngine';

interface OpeningExperienceProps {
  onEnter: () => void;
  senderName?: string;
  recipientName?: string;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  onEnter,
  senderName,
  recipientName,
}) => {
  const handleEnterClick = () => {
    sound.unmute();
    sound.playDiyaLight();
    onEnter();
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden z-20">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
        <svg
          viewBox="0 0 500 500"
          className="w-[700px] h-[700px] animate-spin text-amber-300"
          style={{ animationDuration: '120s' }}
        >
          <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" fill="none" />
          <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" fill="none" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <g key={i} transform={`rotate(${angle} 250 250)`}>
                <path d="M250 70 Q270 120 250 170 Q230 120 250 70 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="250" cy="60" r="4" fill="currentColor" />
              </g>
            );
          })}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-3xl z-30 space-y-6"
      >
        {senderName && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-5 py-2 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md text-amber-200 text-sm font-medium tracking-wide flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {recipientName ? `To ${recipientName}, with` : 'With'} warm Diwali love from{' '}
              <strong className="text-amber-300 font-semibold">{senderName}</strong>
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 text-amber-300/80 tracking-[0.25em] text-xs uppercase font-medium"
        >
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
          <span>Festival of Lights</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="py-4 relative"
        >
          <DiyaIllustration size="hero" showMandalaBase={true} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight text-amber-50 drop-shadow-[0_2px_15px_rgba(243,180,63,0.35)] leading-tight">
            "A little light can brighten <br className="hidden sm:inline" />
            <span className="gold-text font-bold italic">the entire world."</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-amber-200/70 font-light max-w-xl mx-auto tracking-wide">
            Welcome to <span className="text-amber-300 font-medium">Diwali Wonderland</span>. Step across the threshold into an enchanted realm of glowing diyas, celestial fireworks, and timeless celebrations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="pt-4 flex flex-col items-center gap-3"
        >
          <button
            onClick={handleEnterClick}
            className="group relative px-8 sm:px-10 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:shadow-[0_0_55px_rgba(245,158,11,0.7)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_60%)]" />
            <div className="absolute inset-0 rounded-full border border-yellow-200/60" />

            <div className="relative z-10 flex items-center gap-3 text-slate-950 font-semibold tracking-wider text-sm sm:text-base uppercase">
              <Flame className="w-5 h-5 text-amber-950 fill-amber-950 animate-bounce" />
              <span>Enter the Celebration</span>
              <Sparkles className="w-5 h-5 text-amber-950 group-hover:rotate-45 transition-transform" />
            </div>
          </button>

          <div className="flex items-center gap-2 text-xs text-amber-300/60 font-light">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive sound enabled upon entry</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
