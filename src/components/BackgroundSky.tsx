import React, { useMemo } from 'react';

interface BackgroundSkyProps {
  intensity?: number;
}

export const BackgroundSky: React.FC<BackgroundSkyProps> = ({ intensity = 0.2 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: (i * 1.54) % 100,
      y: (i * 2.37) % 65,
      size: (i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2),
      opacity: 0.35 + (i % 5) * 0.12,
      duration: 2.5 + (i % 4) * 0.8,
      delay: (i % 6) * 0.5,
    }));
  }, []);

  const embers = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.7) % 100}%`,
      size: `${2 + (i % 3)}px`,
      duration: `${7 + (i % 5) * 2}s`,
      delay: `${(i % 7) * 1.1}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse 120% 70% at 50% 90%, 
            rgba(245, 158, 11, ${0.12 + intensity * 0.25}) 0%, 
            rgba(30, 16, 55, 0.85) 45%, 
            #0a0d24 75%, 
            #03040b 100%)`,
        }}
      />

      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[55vh] rounded-full blur-[110px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(155, 93, 229, 0.45) 0%, rgba(243, 180, 63, 0.25) 40%, transparent 70%)',
        }}
      />

      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-100"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animation: `pulse ${s.duration}s infinite ease-in-out`,
            animationDelay: `${s.delay}s`,
            boxShadow: s.size > 2 ? '0 0 6px 1px rgba(255, 240, 200, 0.8)' : 'none',
          }}
        />
      ))}

      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute bottom-0 rounded-full bg-gradient-to-t from-amber-400 to-amber-200"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 8px #f59e0b',
            animation: `riseParticle ${e.duration} linear infinite`,
            animationDelay: e.delay,
            opacity: 0.65,
          }}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-40">
        <svg 
          viewBox="0 0 1440 180" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover text-[#030511]"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 180 V120 Q60 110 120 120 T240 120 V80 Q250 50 260 80 V120 H340 Q390 70 440 120 H520 Q560 90 600 120 H720 Q750 40 780 120 H860 Q910 80 960 120 H1060 V70 Q1070 45 1080 70 V120 H1180 Q1220 85 1260 120 H1360 Q1400 95 1440 120 V180 Z" 
            fill="currentColor"
          />
          <circle cx="250" cy="95" r="2.5" fill="#f59e0b" filter="drop-shadow(0 0 4px #f59e0b)" />
          <circle cx="600" cy="115" r="2" fill="#f59e0b" filter="drop-shadow(0 0 3px #f59e0b)" />
          <circle cx="750" cy="65" r="3" fill="#f59e0b" filter="drop-shadow(0 0 6px #f59e0b)" />
          <circle cx="1070" cy="90" r="2.5" fill="#f59e0b" filter="drop-shadow(0 0 4px #f59e0b)" />
          <circle cx="1260" cy="110" r="2" fill="#f59e0b" filter="drop-shadow(0 0 3px #f59e0b)" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none opacity-30">
        <svg 
          viewBox="0 0 1200 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 12 }).map((_, idx) => {
            const startX = idx * 100;
            const midX = startX + 50;
            const endX = startX + 100;
            return (
              <g key={idx}>
                <path 
                  d={`M${startX} 0 Q${midX} 45 ${endX} 0`} 
                  stroke="#c48208" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 3"
                />
                <circle cx={midX} cy="38" r="4.5" fill="#f59e0b" />
                <circle cx={midX} cy="38" r="2.5" fill="#ff7700" />
                <path d={`M${midX} 42 L${midX} 52`} stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
