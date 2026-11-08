import React from 'react';
import { Sparkles, Rocket, Mail, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GrandRevealBannerProps {
  onReLaunch: () => void;
  onOpenGreeting: () => void;
  onDismiss: () => void;
}

export const GrandRevealBanner: React.FC<GrandRevealBannerProps> = ({
  onReLaunch,
  onOpenGreeting,
  onDismiss,
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.3 },
      colors: ['#ffd700', '#ff5400', '#ff007f', '#00b4d8', '#ffffff'],
    });

    // Auto-dismiss the greeting proclamation after 12 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 12000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-x-0 top-16 sm:top-20 z-50 flex flex-col items-center justify-start p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto max-w-2xl w-full bg-[#0a0d20]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-amber-400/50 shadow-[0_0_50px_rgba(245,158,11,0.35)] text-center relative"
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-4 text-neutral-400 hover:text-amber-200 transition-colors p-1"
          aria-label="Close announcement"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] font-cinzel text-amber-300/90">
            Festival of Lights
          </span>
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>

        <h2 className="text-4xl sm:text-6xl font-cinzel font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 tracking-wider drop-shadow-[0_2px_12px_rgba(245,158,11,0.8)] mb-2">
          HAPPY DIWALI!
        </h2>

        <p className="text-sm sm:text-lg font-serif italic text-amber-100/90 leading-relaxed mb-5 max-w-lg mx-auto">
          "May your world always shine with light, happiness and prosperity."
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onReLaunch}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-diya-glow transition-all"
          >
            <Rocket className="w-4 h-4" />
            LAUNCH ANOTHER ROCKET
          </button>

          <button
            onClick={onOpenGreeting}
            className="px-5 py-2.5 rounded-full bg-black/40 text-amber-200 border border-amber-400/50 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all"
          >
            <Mail className="w-4 h-4 text-amber-300" />
            CREATE GREETING CARD
          </button>
        </div>
      </div>
    </div>
  );
};
