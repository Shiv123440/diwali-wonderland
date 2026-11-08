import React from 'react';

interface DiyaIllustrationProps {
  isLit?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
  showMandalaBase?: boolean;
}

export const DiyaIllustration: React.FC<DiyaIllustrationProps> = ({
  isLit = true,
  size = 'md',
  className = '',
  onClick,
  showMandalaBase = false,
}) => {
  const sizeMap = {
    sm: { width: 70, height: 60 },
    md: { width: 120, height: 100 },
    lg: { width: 180, height: 150 },
    hero: { width: 280, height: 240 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-transform duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {showMandalaBase && (
        <div className="absolute -bottom-6 w-[140%] h-12 pointer-events-none opacity-40">
          <svg viewBox="0 0 200 40" fill="none" className="w-full h-full">
            <ellipse cx="100" cy="20" rx="90" ry="15" stroke="#f3b43f" strokeWidth="1" strokeDasharray="4 4" />
            <ellipse cx="100" cy="20" rx="70" ry="10" stroke="#f59e0b" strokeWidth="0.8" />
            <circle cx="100" cy="20" r="4" fill="#ffd700" />
          </svg>
        </div>
      )}

      {isLit && (
        <div
          className="absolute -top-10 w-44 h-44 rounded-full pointer-events-none transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(255, 84, 0, 0.18) 45%, transparent 70%)',
            filter: 'blur(16px)',
          }}
        />
      )}

      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="flameOuter" x1="80" y1="20" x2="80" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fde047" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="flameInner" x1="80" y1="35" x2="80" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="brassGrad" x1="20" y1="70" x2="140" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="brassRim" x1="20" y1="70" x2="140" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <radialGradient id="oilPool" cx="80" cy="74" r="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="70%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1e0b02" />
          </radialGradient>

          <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        <ellipse cx="80" cy="116" rx="34" ry="7" fill="#451a03" opacity="0.6" />
        <path
          d="M62 110 C62 110 70 122 80 122 C90 122 98 110 98 110 L94 104 H66 Z"
          fill="url(#brassGrad)"
          stroke="#d97706"
          strokeWidth="1"
        />

        <path
          d="M20 74 C20 102 50 112 80 112 C110 112 140 102 140 74 C140 70 135 68 128 72 C112 79 96 82 80 82 C64 82 48 79 32 72 C25 68 20 70 20 74 Z"
          fill="url(#brassGrad)"
          stroke="#ffd700"
          strokeWidth="1.2"
        />

        <path
          d="M45 88 Q55 102 65 88 M65 89 Q75 105 85 89 M85 89 Q95 105 105 89 M105 88 Q115 102 125 88"
          stroke="#ffd700"
          strokeWidth="1.2"
          fill="none"
          opacity="0.8"
        />

        <ellipse cx="80" cy="74" rx="58" ry="11" fill="url(#oilPool)" stroke="url(#brassRim)" strokeWidth="1.8" />

        {isLit && (
          <ellipse cx="80" cy="76" rx="44" ry="6" fill="#f59e0b" opacity="0.35" />
        )}

        <path
          d="M80 73 C80 67 81 63 80 58"
          stroke="#262626"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="80" cy="57" r="2.2" fill={isLit ? '#ff4500' : '#404040'} />

        {isLit && (
          <g className="animate-flame" filter="url(#flameGlow)">
            <path
              d="M80 18 C88 32 94 44 91 56 C88 64 84 66 80 66 C76 66 72 64 69 56 C66 44 72 32 80 18 Z"
              fill="url(#flameOuter)"
            />
            <path
              d="M80 34 C84 42 87 50 85 58 C84 62 82 64 80 64 C78 64 76 62 75 58 C73 50 76 42 80 34 Z"
              fill="url(#flameInner)"
            />
            <circle cx="78" cy="12" r="1.2" fill="#ffd700" opacity="0.8" />
            <circle cx="83" cy="7" r="0.9" fill="#f59e0b" opacity="0.6" />
          </g>
        )}
      </svg>
    </div>
  );
};
