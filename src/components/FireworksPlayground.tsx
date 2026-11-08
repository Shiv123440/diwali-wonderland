import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Pause, Compass, Heart, Flame } from 'lucide-react';
import { FireworkType } from './canvas/FireworksCanvas';
import { sound } from '../services/audioEngine';

interface FireworksPlaygroundProps {
  activeType: FireworkType;
  onChangeType: (type: FireworkType) => void;
  isAutoMode: boolean;
  onToggleAutoMode: () => void;
  fireworkCount: number;
}

const FIREWORK_MODES: { id: FireworkType; name: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'willow', name: 'Golden Willow', icon: <Flame className="w-4 h-4 text-amber-400" />, desc: 'Cascading golden streamers' },
  { id: 'peony', name: 'Royal Peony', icon: <Sparkles className="w-4 h-4 text-pink-400" />, desc: 'Vibrant spherical petals' },
  { id: 'chrysanthemum', name: 'Chrysanthemum', icon: <Sparkles className="w-4 h-4 text-yellow-300" />, desc: 'Crackling starry bursts' },
  { id: 'heart', name: 'Sacred Heart', icon: <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />, desc: 'Auspicious loving symbol' },
  { id: 'ring', name: 'Cosmic Saturn Ring', icon: <Compass className="w-4 h-4 text-cyan-400" />, desc: 'Planetary glowing ring' },
  { id: 'stars', name: 'Twinkling Stars', icon: <Sparkles className="w-4 h-4 text-purple-300" />, desc: 'Glittering diamond showers' },
];

export const FireworksPlayground: React.FC<FireworksPlaygroundProps> = ({
  activeType,
  onChangeType,
  isAutoMode,
  onToggleAutoMode,
  fireworkCount,
}) => {
  const [showHint, setShowHint] = useState(true);

  const handleSelectType = (type: FireworkType) => {
    sound.playClick();
    onChangeType(type);
  };

  const handleToggleAuto = () => {
    sound.playClick();
    onToggleAutoMode();
  };

  return (
    <div className="relative w-full h-full min-h-[85vh] flex flex-col justify-between items-center px-4 py-8 pointer-events-none select-none z-20">
      <div className="flex flex-col items-center text-center max-w-md pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md mb-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
          <span className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
            Fireworks Playground
          </span>
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-xl bg-slate-900/80 border border-amber-400/20 backdrop-blur-md text-amber-100 text-xs sm:text-sm flex items-center gap-3 shadow-lg"
          >
            <span>✨ Tap or click anywhere in the night sky to launch rockets!</span>
            <button
              onClick={() => setShowHint(false)}
              className="text-amber-400 hover:text-amber-200 text-xs font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-3 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-950/75 border border-amber-500/25 backdrop-blur-xl shadow-2xl">
          {FIREWORK_MODES.map((mode) => {
            const isActive = activeType === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleSelectType(mode.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-md scale-105'
                    : 'text-amber-200/70 hover:text-amber-100 hover:bg-white/5'
                }`}
                title={mode.desc}
              >
                {mode.icon}
                <span>{mode.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between w-full px-4 text-xs text-amber-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Explosions Ignited: <strong className="text-amber-300 font-semibold">{fireworkCount}</strong></span>
          </div>

          <button
            onClick={handleToggleAuto}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              isAutoMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-slate-900/80 text-amber-300 border-amber-500/30 hover:bg-slate-800'
            }`}
          >
            {isAutoMode ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-amber-300" />}
            <span>{isAutoMode ? 'Stop Auto Show' : 'Continuous Sky Show'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
