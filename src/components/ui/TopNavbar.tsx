import React from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw, Compass, Sun, Moon } from 'lucide-react';
import { CameraPreset } from '../cinematic/CameraController';
import { audioManager } from '../../utils/audio';

interface TopNavbarProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onReplayIntro: () => void;
  quality: 'high' | 'medium';
  onToggleQuality: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentPreset,
  onSelectPreset,
  isMuted,
  onToggleMute,
  onReplayIntro,
  quality,
  onToggleQuality,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:px-8 sm:py-4 pointer-events-none flex items-center justify-between">
      {/* Brand & Crest */}
      <div className="pointer-events-auto flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-amber-400/25 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-neutral-950 font-bold shadow-diya-glow">
          <Sparkles className="w-4 h-4 text-neutral-950" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-cinzel font-bold tracking-[0.15em] text-amber-200">
            DIWALI WONDERLAND
          </h1>
          <p className="text-[10px] text-amber-400/70 uppercase tracking-widest hidden sm:block">
            Royal Courtyard Experience
          </p>
        </div>
      </div>

      {/* Camera View Switcher */}
      <div className="pointer-events-auto hidden md:flex items-center gap-1 glass-panel px-2 py-1.5 rounded-full border border-amber-400/20">
        <div className="flex items-center gap-1 text-[11px] font-cinzel tracking-wider px-2 text-amber-300/80">
          <Compass className="w-3.5 h-3.5" />
          <span>VIEW:</span>
        </div>
        {(
          [
            { id: 'courtyard' as CameraPreset, label: 'Courtyard' },
            { id: 'rocket' as CameraPreset, label: 'Rocket' },
            { id: 'altar' as CameraPreset, label: 'Diya Altar' },
            { id: 'rangoli' as CameraPreset, label: 'Rangoli' },
            { id: 'sky' as CameraPreset, label: 'Sky' },
          ]
        ).map((item) => {
          const isActive = currentPreset === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectPreset(item.id);
                audioManager.playDiyaLight();
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                  : 'text-neutral-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onToggleQuality}
          title={`Quality: ${quality.toUpperCase()}`}
          className="glass-panel w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-amber-200 hover:bg-amber-500/20 transition-all border border-amber-400/20"
        >
          {quality === 'high' ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-amber-300/70" />
          )}
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="glass-panel w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-amber-200 hover:bg-amber-500/20 transition-all border border-amber-400/20"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-neutral-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
          )}
        </button>

        <button
          onClick={onReplayIntro}
          title="Replay Cinematic Intro"
          className="glass-panel w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-amber-200 hover:bg-amber-500/20 transition-all border border-amber-400/20"
        >
          <RotateCcw className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </header>
  );
};
