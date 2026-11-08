import React from 'react';
import { Palette, Sparkles, X, Check } from 'lucide-react';
import { audioManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface RangoliModalProps {
  colors: string[];
  onChangeColor: (index: number, newColor: string) => void;
  patternName: string;
  onChangePattern: (name: string) => void;
  onClose: () => void;
}

export const RangoliModal: React.FC<RangoliModalProps> = ({
  colors,
  onChangeColor,
  patternName,
  onChangePattern,
  onClose,
}) => {
  const colorPalette = [
    { name: 'Sindoor Red', hex: '#b81424' },
    { name: 'Haldi Gold', hex: '#f59e0b' },
    { name: 'Peacock Azure', hex: '#0077b6' },
    { name: 'Parrot Emerald', hex: '#10b981' },
    { name: 'Royal Magenta', hex: '#d90429' },
    { name: 'Pure Marble White', hex: '#ffffff' },
    { name: 'Midnight Violet', hex: '#7209b7' },
    { name: 'Warm Saffron', hex: '#ff5400' },
  ];

  const patterns = [
    { id: 'lotus', label: '8-Petal Sacred Lotus' },
    { id: 'peacock', label: 'Royal Peacock Mandala' },
    { id: 'lakshmi', label: 'Auspicious Star of Lakshmi' },
  ];

  const handleCelebrate = () => {
    audioManager.playGiftOpen();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
  };

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-40 max-w-sm w-full glass-panel p-5 rounded-2xl border border-amber-400/40 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
            <Palette className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
              RANGOLI STUDIO
            </h2>
            <p className="text-[10px] text-amber-400/70">Courtyard Powder Mandala</p>
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
        Customize sacred geometric patterns and vibrant organic powders (Gulal) on the courtyard marble floor.
      </p>

      <div className="mb-4">
        <label className="text-[11px] font-cinzel text-amber-300 block mb-1.5">
          SACRED MANDALA PATTERN:
        </label>
        <div className="space-y-1">
          {patterns.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onChangePattern(p.id);
                audioManager.playDiyaLight();
              }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                patternName === p.id
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                  : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[11px] font-cinzel text-amber-300 block mb-1.5">
          OUTER PETAL GULAL:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colorPalette.map((col) => {
            const isSelected = colors[0] === col.hex;
            return (
              <button
                key={col.name}
                onClick={() => {
                  onChangeColor(0, col.hex);
                  audioManager.playDiyaLight();
                }}
                className={`relative h-8 rounded-lg border transition-all flex items-center justify-center ${
                  isSelected ? 'border-amber-300 scale-105 shadow-md' : 'border-white/10 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              >
                {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[11px] font-cinzel text-amber-300 block mb-1.5">
          INNER RING GULAL:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colorPalette.map((col) => {
            const isSelected = colors[1] === col.hex;
            return (
              <button
                key={col.name}
                onClick={() => {
                  onChangeColor(1, col.hex);
                  audioManager.playDiyaLight();
                }}
                className={`relative h-8 rounded-lg border transition-all flex items-center justify-center ${
                  isSelected ? 'border-amber-300 scale-105 shadow-md' : 'border-white/10 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              >
                {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleCelebrate}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-diya-glow transition-all"
      >
        <Sparkles className="w-3.5 h-3.5" />
        BLESS & SPARKLE RANGOLI
      </button>
    </div>
  );
};
