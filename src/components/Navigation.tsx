import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Rocket,
  Flame,
  Sparkles,
  Palette,
  Gift,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  HelpCircle,
  Home,
  X,
} from 'lucide-react';
import { sound } from '../services/audioEngine';

export type ExperienceTab = 'rocket' | 'diyas' | 'fireworks' | 'rangoli' | 'surprise' | 'wishes';

interface NavigationProps {
  activeTab: ExperienceTab;
  onSelectTab: (tab: ExperienceTab) => void;
  onGoHome: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
}

const NAV_ITEMS: { id: ExperienceTab; label: string; icon: React.ReactNode }[] = [
  { id: 'rocket', label: 'Launch Rocket', icon: <Rocket className="w-4 h-4" /> },
  { id: 'diyas', label: 'Light Diyas', icon: <Flame className="w-4 h-4" /> },
  { id: 'fireworks', label: 'Sky Fireworks', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'rangoli', label: 'Rangoli Studio', icon: <Palette className="w-4 h-4" /> },
  { id: 'surprise', label: 'Mithai Gift', icon: <Gift className="w-4 h-4" /> },
  { id: 'wishes', label: 'Send Wishes', icon: <Send className="w-4 h-4" /> },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onGoHome,
  isMuted,
  onToggleSound,
  onRestart,
}) => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const handleTabClick = (tab: ExperienceTab) => {
    sound.playClick();
    onSelectTab(tab);
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 px-4 flex items-center justify-between pointer-events-none z-40">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 border border-amber-500/30 backdrop-blur-md text-amber-200 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95"
            title="Return to Welcome Screen"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-serif font-bold text-xs tracking-wider gold-text hidden sm:inline">
              DIWALI WONDERLAND
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full border backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 ${
              isMuted
                ? 'bg-slate-950/80 border-slate-700 text-slate-400'
                : 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
            }`}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          <button
            onClick={onRestart}
            className="p-2 rounded-full bg-slate-950/75 border border-amber-500/30 backdrop-blur-md text-amber-300/80 hover:text-amber-200 transition-all shadow-lg hover:scale-105 active:scale-95"
            title="Restart Celebration"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowHelp(true);
            }}
            className="p-2 rounded-full bg-slate-950/75 border border-amber-500/30 backdrop-blur-md text-amber-300/80 hover:text-amber-200 transition-all shadow-lg hover:scale-105 active:scale-95"
            title="Celebration Guide & Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-950/85 border border-amber-500/35 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-40 max-w-[95vw] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md scale-105'
                    : 'text-amber-200/70 hover:text-amber-100 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181135] to-[#090b1e] border border-amber-400/40 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-serif font-bold text-amber-100">
                    Diwali Wonderland Guide
                  </h3>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-amber-100/80">
                <div className="flex gap-2.5">
                  <span className="text-amber-400 font-bold">🚀 Launch Rocket:</span>
                  <span>Click the glowing fuse with the sparkler, step back, and witness the grand cinematic skyburst reveal!</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-400 font-bold">🪔 Light Sacred Diyas:</span>
                  <span>Ignite all 7 sacred diyas in the royal courtyard to trigger the Maha Deepotsav blessing.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-400 font-bold">✨ Fireworks Playground:</span>
                  <span>Tap anywhere in the night sky to shoot rockets, switch explosion styles, or toggle continuous auto-show.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-400 font-bold">🎨 Rangoli Studio:</span>
                  <span>Draw with 8-fold radial mandala symmetry, add golden dust, and save high-res artwork.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-400 font-bold">🎁 Mithai Gift Box:</span>
                  <span>Unwrap traditional Indian festive sweets and personalized auspicious fortunes.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-400 font-bold">💌 Subhkamnayein Cards:</span>
                  <span>Generate customized greeting cards with your name, download image, or share directly.</span>
                </div>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Close & Return to Celebration
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
