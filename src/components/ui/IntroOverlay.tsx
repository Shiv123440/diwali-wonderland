import React, { useEffect, useState } from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface IntroOverlayProps {
  onEnter: () => void;
  onDiyaIgnited: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onEnter, onDiyaIgnited }) => {
  const [step, setStep] = useState<'darkness' | 'spark_travel' | 'diya_glow' | 'reveal'>('darkness');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep('spark_travel');
    }, 400);

    const t2 = setTimeout(() => {
      setStep('diya_glow');
      audioManager.playDiyaLight();
      onDiyaIgnited();
    }, 2200);

    const t3 = setTimeout(() => {
      setStep('reveal');
      audioManager.startAmbient();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDiyaIgnited]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 sm:p-12 transition-colors duration-1000">
      <div
        className={`absolute inset-0 bg-[#05060f] transition-opacity duration-1000 ${
          step === 'darkness'
            ? 'opacity-100'
            : step === 'spark_travel'
            ? 'opacity-95'
            : step === 'diya_glow'
            ? 'opacity-70'
            : 'opacity-0'
        }`}
      />

      {step === 'spark_travel' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-amber-300 rounded-full shadow-[0_0_40px_15px_#f59e0b] animate-ping" />
        </div>
      )}

      <div
        className={`relative z-10 text-center transition-opacity duration-1000 ${
          step === 'reveal' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-xs uppercase tracking-[0.4em] text-amber-300/70 font-cinzelText">
          ✦ Royal Palace Deepotsav ✦
        </span>
      </div>

      <div
        className={`relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto transition-all duration-1000 transform ${
          step === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="w-12 h-12 mb-4 rounded-full border border-amber-400/40 flex items-center justify-center bg-amber-500/10 backdrop-blur-md">
          <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-[0_4px_20px_rgba(245,158,11,0.4)] mb-4">
          LIGHT UP THE NIGHT.
        </h1>

        <p className="text-lg sm:text-2xl font-serif italic text-amber-100/85 mb-8 tracking-wide">
          Celebrate the magic of Diwali in an interactive 3D royal world.
        </p>

        <button
          onClick={() => {
            audioManager.playDiyaLight();
            onEnter();
          }}
          className="pointer-events-auto group relative px-8 py-4 sm:px-10 sm:py-5 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(243,180,63,0.35)] hover:shadow-[0_0_45px_rgba(243,180,63,0.6)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 transition-opacity duration-300 group-hover:opacity-90" />
          <div className="absolute inset-0 border border-amber-200/50 rounded-full" />

          <span className="relative z-10 flex items-center gap-3 text-sm sm:text-base font-cinzel font-bold tracking-[0.2em] text-neutral-950">
            <Sparkles className="w-4 h-4 text-neutral-950 animate-spin" style={{ animationDuration: '6s' }} />
            ENTER THE CELEBRATION
            <Sparkles className="w-4 h-4 text-neutral-950 animate-spin" style={{ animationDuration: '6s' }} />
          </span>
        </button>

        <p className="mt-4 text-xs font-sans text-amber-200/60 tracking-wider">
          Click and drag to rotate • Click diyas to illuminate
        </p>
      </div>

      <div
        className={`relative z-10 text-center transition-opacity duration-1000 ${
          step === 'reveal' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-[11px] text-amber-100/50 uppercase tracking-widest">
          Headphones Recommended for 3D Audio Experience
        </span>
      </div>
    </div>
  );
};
