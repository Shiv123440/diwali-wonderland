import React from 'react';
import { Flame, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface DiyaCeremonyModalProps {
  litDiyas: boolean[];
  onLightAll: () => void;
  onToggleDiya: (index: number) => void;
  onClose: () => void;
}

export const DiyaCeremonyModal: React.FC<DiyaCeremonyModalProps> = ({
  litDiyas,
  onLightAll,
  onToggleDiya,
  onClose,
}) => {
  const litCount = litDiyas.filter(Boolean).length;
  const isComplete = litCount === litDiyas.length;

  const diyaNames = [
    'Altar North-West Diya',
    'Altar North-East Diya',
    'Altar South-West Diya',
    'Altar South-East Diya',
    'West Colonnade Pillar Diya',
    'East Colonnade Pillar Diya',
    'South-West Steps Diya',
    'South-East Steps Diya',
  ];

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-40 max-w-sm w-full glass-panel p-5 rounded-2xl border border-amber-400/40 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
            <Flame className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
              SACRED DIYA CEREMONY
            </h2>
            <p className="text-[10px] text-amber-400/70">
              Illuminated: {litCount} / {litDiyas.length}
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

      <div className="w-full bg-neutral-900 rounded-full h-2 mb-4 border border-amber-400/20 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 h-full transition-all duration-500 shadow-diya-glow"
          style={{ width: `${(litCount / litDiyas.length) * 100}%` }}
        />
      </div>

      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 mb-4">
        {litDiyas.map((isLit, idx) => (
          <button
            key={idx}
            onClick={() => {
              onToggleDiya(idx);
              audioManager.playDiyaLight();
            }}
            className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all ${
              isLit
                ? 'bg-amber-500/20 border border-amber-400/30 text-amber-200'
                : 'bg-white/5 border border-white/5 text-neutral-400 hover:text-amber-200 hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <Flame
                className={`w-3.5 h-3.5 ${
                  isLit ? 'text-amber-400 animate-pulse' : 'text-neutral-500'
                }`}
              />
              {diyaNames[idx]}
            </span>
            {isLit ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <span className="text-[10px] text-amber-300/60 uppercase">Click to Light</span>
            )}
          </button>
        ))}
      </div>

      {isComplete ? (
        <div className="p-3 bg-amber-500/20 border border-amber-400/50 rounded-xl text-center space-y-1">
          <p className="text-xs font-cinzel font-bold text-amber-200 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            DEEPOTSAV AARTI COMPLETE!
            <Sparkles className="w-4 h-4 text-amber-300" />
          </p>
          <p className="text-[11px] text-amber-100/80">
            The royal palace courtyard shines in full divine brilliance.
          </p>
        </div>
      ) : (
        <button
          onClick={() => {
            onLightAll();
            audioManager.playAllDiyasLit();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-diya-glow transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          ILLUMINATE ALL DIYAS
        </button>
      )}

      <p className="mt-3 text-[10px] text-center text-amber-200/50">
        You can also click directly on any 3D Diya in the courtyard!
      </p>
    </div>
  );
};
