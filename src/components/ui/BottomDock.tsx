import React from 'react';
import { Rocket, Flame, Sparkles, Send, Palette, Gift, Mail } from 'lucide-react';
import { audioManager } from '../../utils/audio';

export type ActiveActivity =
  | 'none'
  | 'rocket'
  | 'diya'
  | 'fireworks'
  | 'lanterns'
  | 'rangoli'
  | 'surprise'
  | 'greeting';

interface BottomDockProps {
  activeActivity: ActiveActivity;
  onSelectActivity: (activity: ActiveActivity) => void;
  litDiyasCount: number;
  totalDiyas: number;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeActivity,
  onSelectActivity,
  litDiyasCount,
  totalDiyas,
}) => {
  const dockItems: {
    id: ActiveActivity;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    highlight: boolean;
  }[] = [
    {
      id: 'rocket',
      label: 'Rocket Launch',
      icon: Rocket,
      badge: 'Main',
      highlight: true,
    },
    {
      id: 'diya',
      label: 'Diya Ceremony',
      icon: Flame,
      badge: `${litDiyasCount}/${totalDiyas}`,
      highlight: false,
    },
    {
      id: 'fireworks',
      label: 'Fireworks Sky',
      icon: Sparkles,
      badge: undefined,
      highlight: false,
    },
    {
      id: 'lanterns',
      label: 'Sky Lanterns',
      icon: Send,
      badge: undefined,
      highlight: false,
    },
    {
      id: 'rangoli',
      label: 'Rangoli Studio',
      icon: Palette,
      badge: undefined,
      highlight: false,
    },
    {
      id: 'surprise',
      label: 'Royal Gift',
      icon: Gift,
      badge: 'Surprise',
      highlight: false,
    },
    {
      id: 'greeting',
      label: 'Greetings',
      icon: Mail,
      badge: undefined,
      highlight: false,
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-3 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-amber-400/30 shadow-2xl max-w-full overflow-x-auto scrollbar-none">
        {dockItems.map((item) => {
          const isActive = activeActivity === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectActivity(isActive ? 'none' : item.id);
                audioManager.playDiyaLight();
              }}
              className={`relative group flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold shadow-diya-glow scale-105'
                  : item.highlight
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
                  : 'text-neutral-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? 'text-neutral-950 animate-bounce'
                    : item.highlight
                    ? 'text-amber-300'
                    : 'text-neutral-300 group-hover:text-amber-300'
                }`}
              />

              <span className="hidden sm:inline font-cinzelText">{item.label}</span>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isActive
                      ? 'bg-neutral-950/30 text-neutral-900 font-bold'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
