import React from 'react';
import { Sparkles, X, Wand2 } from 'lucide-react';
import { audioManager } from '../../utils/audio';

export type FireworkType = 'gold' | 'ruby' | 'emerald' | 'peacock';

interface FireworksModalProps {
  selectedType: FireworkType;
  onSelectType: (type: FireworkType) => void;
  onLaunchRandom: () => void;
  onClose: () => void;
}

export const FireworksModal: React.FC<FireworksModalProps> = ({
  selectedType,
  onSelectType,
  onLaunchRandom,
  onClose,
}) => {
  const types: { id: FireworkType; label: string; desc: string; color: string }[] = [
    {
      id: 'gold',
      label: 'Golden Chrysanthemum',
      desc: 'Classic imperial gold palm with kamuro weeping trails',
      color: 'from-amber-400 to-yellow-600',
    },
    {
      id: 'ruby',
      label: 'Royal Ruby Peony',
      desc: 'Radiant magenta and vermilion spherical burst',
      color: 'from-rose-500 to-red-700',
    },
    {
      id: 'emerald',
      label: 'Emerald Willow',
      desc: 'Lush green stardust cascading under gravity',
      color: 'from-emerald-400 to-teal-700',
    },
    {
      id: 'peacock',
      label: 'Peacock Starburst',
      desc: 'Vibrant azure, cyan and violet glittering stars',
      color: 'from-sky-400 to-indigo-700',
    },
  ];

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-40 max-w-sm w-full glass-panel p-5 rounded-2xl border border-amber-400/40 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
              FIREWORKS PLAYGROUND
            </h2>
            <p className="text-[10px] text-amber-400/70">Interactive Sky Celebration</p>
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
        Select a fireworks pattern, then launch into the royal night sky!
      </p>

      <div className="space-y-2 mb-4">
        {types.map((item) => {
          const isSelected = selectedType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectType(item.id);
                audioManager.playDiyaLight();
              }}
              className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400/60 shadow-diya-glow'
                  : 'bg-white/5 border-white/5 hover:border-amber-400/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-cinzel font-bold text-amber-200">
                  {item.label}
                </span>
                <span
                  className={`w-3 h-3 rounded-full bg-gradient-to-tr ${item.color} shadow-sm`}
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">{item.desc}</p>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => {
          onLaunchRandom();
          audioManager.playRocketLaunch();
        }}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-diya-glow transition-all"
      >
        <Wand2 className="w-3.5 h-3.5" />
        BURST SHELL IN SKY
      </button>

      <p className="mt-3 text-[10px] text-center text-amber-200/50">
        💡 Tip: You can also click directly anywhere in the 3D sky to launch!
      </p>
    </div>
  );
};
