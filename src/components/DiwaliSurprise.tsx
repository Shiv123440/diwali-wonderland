import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, RotateCcw } from 'lucide-react';
import { sound } from '../services/audioEngine';

interface SweetSurprise {
  name: string;
  hindiName: string;
  description: string;
  fortune: string;
  accentColor: string;
  iconSymbol: string;
}

const SURPRISES: SweetSurprise[] = [
  {
    name: 'Kaju Katli',
    hindiName: 'काजू कतली',
    description: 'Diamond-cut royal cashew fudge adorned with shimmering silver varq.',
    fortune: 'May sharp intellect, shining fortunes, and radiant good news illuminate every corner of your life.',
    accentColor: '#e2e8f0',
    iconSymbol: '💎',
  },
  {
    name: 'Motichoor Ladoo',
    hindiName: 'मोतीचूर लड्डू',
    description: 'Golden micro-pearls of gram flour soaked in saffron syrup and pure ghee.',
    fortune: 'May every tiny effort of yours come together like golden pearls into grand success and prosperity.',
    accentColor: '#f59e0b',
    iconSymbol: '🌟',
  },
  {
    name: 'Royal Gulab Jamun',
    hindiName: 'गुलाब जामुन',
    description: 'Caramelized milk dumplings steeped in fragrant rosewater and green cardamom elixir.',
    fortune: 'May sweetness melt away all grievances and fill your home with deep warmth and unbreakable family bonds.',
    accentColor: '#b45309',
    iconSymbol: '🌹',
  },
  {
    name: 'Kesar Pistachio Peda',
    hindiName: 'केसर पिस्ता पेड़ा',
    description: 'Traditional Mathura fudge infused with Kashmiri saffron strands and crushed pistachios.',
    fortune: 'May wisdom, auspicious beginnings, and Lord Ganesha’s grace protect you on all journeys.',
    accentColor: '#ffd700',
    iconSymbol: '✨',
  },
  {
    name: 'Silken Rasgulla',
    hindiName: 'रसगुल्ला',
    description: 'Delicate snow-white cottage cheese spheres soaked in pure, clarifying nectar.',
    fortune: 'May peace and serenity remain steadfast in your heart, light as a feather, untouched by darkness.',
    accentColor: '#ffffff',
    iconSymbol: '🕊️',
  },
];

export const DiwaliSurprise: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSurprise, setCurrentSurprise] = useState<SweetSurprise>(SURPRISES[0]);

  const handleOpenBox = () => {
    if (isOpen) return;
    sound.playGiftOpen();
    const randomIndex = Math.floor(Math.random() * SURPRISES.length);
    setCurrentSurprise(SURPRISES[randomIndex]);
    setIsOpen(true);
  };

  const handleReset = () => {
    sound.playClick();
    setIsOpen(false);
  };

  return (
    <div className="relative w-full h-full min-h-[85vh] flex flex-col items-center justify-between px-4 py-8 select-none z-20">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md mb-2">
          <Gift className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
            Royal Mithai & Shubh Box
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
          Unwrap Your Diwali Blessing
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mt-1">
          {isOpen
            ? 'A celestial sweet and auspicious fortune revealed for you!'
            : 'Tap the royal gift box to unwrap authentic festive sweets and a personal Diwali prophecy.'}
        </p>
      </div>

      <div className="relative w-full max-w-md flex flex-col items-center justify-center my-6">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              onClick={handleOpenBox}
              className="relative w-64 h-64 sm:w-72 sm:h-72 cursor-pointer group flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl group-hover:bg-amber-500/35 transition-all duration-500" />

              <svg viewBox="0 0 200 200" className="w-full h-full transition-transform duration-300 group-hover:scale-105 active:scale-95 drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
                <defs>
                  <linearGradient id="velvetBody" x1="40" y1="70" x2="160" y2="170" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#991b1b" />
                    <stop offset="50%" stopColor="#7f1d1d" />
                    <stop offset="100%" stopColor="#450a0a" />
                  </linearGradient>

                  <linearGradient id="boxLid" x1="30" y1="50" x2="170" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#b91c1c" />
                    <stop offset="70%" stopColor="#7f1d1d" />
                    <stop offset="100%" stopColor="#450a0a" />
                  </linearGradient>

                  <linearGradient id="goldRibbon" x1="90" y1="40" x2="110" y2="170" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="50%" stopColor="#fffbeb" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>

                <ellipse cx="100" cy="180" rx="65" ry="12" fill="#000000" opacity="0.6" />
                <rect x="45" y="80" width="110" height="90" rx="8" fill="url(#velvetBody)" stroke="#f59e0b" strokeWidth="1.2" />
                <rect x="38" y="60" width="124" height="26" rx="6" fill="url(#boxLid)" stroke="#ffd700" strokeWidth="1.5" />
                <rect x="92" y="60" width="16" height="110" fill="url(#goldRibbon)" />
                <rect x="45" y="115" width="110" height="14" fill="url(#goldRibbon)" />
                <path d="M100 60 C80 30 55 45 92 58 Z" fill="url(#goldRibbon)" stroke="#ffd700" strokeWidth="1" />
                <path d="M100 60 C120 30 145 45 108 58 Z" fill="url(#goldRibbon)" stroke="#ffd700" strokeWidth="1" />
                <circle cx="100" cy="60" r="7" fill="#ffd700" stroke="#b45309" strokeWidth="1" />
              </svg>

              <div className="absolute -bottom-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 backdrop-blur-md text-amber-200 text-xs font-semibold tracking-wider flex items-center gap-1.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tap to Open Gift</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="opened-box"
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, type: 'spring', damping: 18 }}
              className="relative w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c1236] to-[#0d0922] border border-amber-400/40 shadow-[0_0_50px_rgba(243,180,63,0.3)] text-center space-y-4"
            >
              <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-600/30 border border-amber-400/50 flex items-center justify-center text-4xl shadow-lg">
                <span className="animate-bounce">{currentSurprise.iconSymbol}</span>
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-spin" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  {currentSurprise.hindiName}
                </span>
                <h3 className="text-2xl font-serif font-bold text-amber-100">
                  {currentSurprise.name}
                </h3>
                <p className="text-xs text-amber-200/70 mt-1 italic">
                  {currentSurprise.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-100 font-serif text-sm leading-relaxed">
                "{currentSurprise.fortune}"
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Open Another Gift</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-6" />
    </div>
  );
};
