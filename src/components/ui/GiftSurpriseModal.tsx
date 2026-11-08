import React from 'react';
import { Gift, Sparkles, X, Heart, Coins, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GiftSurpriseModalProps {
  onClose: () => void;
  onOpenGreeting: () => void;
}

export const GiftSurpriseModal: React.FC<GiftSurpriseModalProps> = ({
  onClose,
  onOpenGreeting,
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#ffd700', '#dfa234', '#ff7700', '#ffffff'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div className="pointer-events-auto max-w-lg w-full glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/50 shadow-[0_0_50px_rgba(245,158,11,0.35)] backdrop-blur-2xl animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-amber-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 flex items-center justify-center text-neutral-950 font-bold shadow-diya-glow">
          <Gift className="w-7 h-7 text-neutral-950" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-center text-amber-200 mb-1">
          ROYAL DIWALI SURPRISE
        </h3>
        <p className="text-xs text-center text-amber-400/70 mb-5">
          ✦ Auspicious Festive Hamper Unveiled ✦
        </p>

        <div className="space-y-2.5 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-amber-400/20">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xs font-cinzel font-bold text-amber-200">
                Pure Silver Lakshmi-Ganesh Coin
              </h4>
              <p className="text-[11px] text-neutral-300">
                Symbol of eternal wealth, divine wisdom, and auspicious new ventures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-amber-400/20">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xs font-cinzel font-bold text-amber-200">
                Royal Kaju Katli & Saffron Sweets
              </h4>
              <p className="text-[11px] text-neutral-300">
                Artisanal silver-foiled cashew delicacies sharing festive sweetness.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-amber-400/20">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xs font-cinzel font-bold text-amber-200">
                Shubh Deepawali Verse
              </h4>
              <p className="text-[11px] font-serif italic text-amber-100/90">
                "Tamso Ma Jyotirgamaya — From darkness unto divine light."
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenGreeting();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-diya-glow transition-all"
          >
            <Heart className="w-4 h-4 text-neutral-950 fill-neutral-950" />
            SHARE BLESSING WITH FAMILY
          </button>
        </div>
      </div>
    </div>
  );
};
