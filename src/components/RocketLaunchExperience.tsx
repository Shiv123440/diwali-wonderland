import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, RotateCcw, ArrowRight } from 'lucide-react';
import { sound } from '../services/audioEngine';
import { FireworksCanvasHandle } from './canvas/FireworksCanvas';

interface RocketLaunchExperienceProps {
  canvasRef: React.RefObject<FireworksCanvasHandle | null>;
  onNavigateToDiyas?: () => void;
  onNavigateToPlayground?: () => void;
}

type LaunchStage = 'idle' | 'igniting' | 'launching' | 'exploded' | 'revealed';

export const RocketLaunchExperience: React.FC<RocketLaunchExperienceProps> = ({
  canvasRef,
  onNavigateToDiyas,
  onNavigateToPlayground,
}) => {
  const [stage, setStage] = useState<LaunchStage>('idle');
  const [fuseProgress, setFuseProgress] = useState<number>(0);
  const [rocketY, setRocketY] = useState<number>(0);
  const [rocketX, setRocketX] = useState<number>(0);
  const [rocketAngle, setRocketAngle] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (stage === 'idle' || stage === 'igniting') {
      const rect = e.currentTarget.getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleIgnite = () => {
    if (stage !== 'idle') return;

    setStage('igniting');
    sound.playMatchStrike();
    sound.startFuseSound();

    const startTime = performance.now();
    const duration = 2400;

    const animateFuse = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setFuseProgress(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateFuse);
      } else {
        sound.stopFuseSound();
        triggerLaunch();
      }
    };

    animFrameRef.current = requestAnimationFrame(animateFuse);
  };

  const triggerLaunch = () => {
    setStage('launching');
    sound.playRocketLaunch();

    const launchStartTime = performance.now();
    const launchDuration = 1800;

    const animateFlight = (time: number) => {
      const elapsed = time - launchStartTime;
      const p = elapsed / launchDuration;

      if (p < 1) {
        const easeInQuad = p * p * p;
        const currentY = -easeInQuad * (window.innerHeight * 0.78);
        
        const currentX = Math.sin(p * Math.PI * 3) * 35;
        const currentAngle = Math.sin(p * Math.PI * 3) * 6;

        setRocketY(currentY);
        setRocketX(currentX);
        setRocketAngle(currentAngle);

        animFrameRef.current = requestAnimationFrame(animateFlight);
      } else {
        triggerApexExplosion();
      }
    };

    animFrameRef.current = requestAnimationFrame(animateFlight);
  };

  const triggerApexExplosion = () => {
    setStage('exploded');

    if (canvasRef.current) {
      const centerX = window.innerWidth / 2;
      const apexY = window.innerHeight * 0.22;

      canvasRef.current.triggerExplosion(centerX, apexY, 'willow');

      setTimeout(() => {
        canvasRef.current?.triggerExplosion(centerX - 90, apexY + 40, 'chrysanthemum', ['#ff3366', '#ffd700', '#ff9900', '#9b5de5']);
      }, 150);

      setTimeout(() => {
        canvasRef.current?.triggerExplosion(centerX + 110, apexY - 30, 'ring', ['#00f5d4', '#fee440', '#f15bb5', '#ffffff']);
      }, 350);
    }

    setTimeout(() => {
      setStage('revealed');
    }, 600);
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sound.stopFuseSound();
    setStage('idle');
    setFuseProgress(0);
    setRocketY(0);
    setRocketX(0);
    setRocketAngle(0);
    sound.playClick();
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      sound.stopFuseSound();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-[85vh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden z-20"
    >
      <div 
        className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 ${
          stage === 'launching' ? 'opacity-55' : 'opacity-0'
        }`}
      />

      <div className="relative z-30 flex flex-col items-center text-center mt-2">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full backdrop-blur-md border shadow-xl transition-all"
          style={{
            borderColor: stage === 'igniting' ? '#f59e0b' : stage === 'revealed' ? '#ffd700' : 'rgba(243, 180, 63, 0.3)',
            backgroundColor: stage === 'igniting' ? 'rgba(234, 88, 12, 0.25)' : 'rgba(10, 13, 36, 0.75)',
          }}
        >
          {stage === 'idle' && (
            <>
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <span className="text-amber-200 text-sm sm:text-base font-medium tracking-wide">
                Touch or click the fuse tip with the sparkler to ignite!
              </span>
            </>
          )}

          {stage === 'igniting' && (
            <>
              <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
              <span className="text-orange-200 text-sm sm:text-base font-bold tracking-wider animate-pulse">
                STAND BACK! FUSE BURNING... LAUNCH IMMINENT!
              </span>
            </>
          )}

          {stage === 'launching' && (
            <>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-ping" />
              <span className="text-yellow-100 text-sm sm:text-base font-bold tracking-widest uppercase">
                ROCKET IN FLIGHT! WATCH THE SKY!
              </span>
            </>
          )}

          {(stage === 'exploded' || stage === 'revealed') && (
            <>
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-amber-200 text-sm sm:text-base font-medium">
                Celestial Blast Achieved
              </span>
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {stage === 'revealed' && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, type: 'spring', damping: 15 }}
            className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 flex flex-col items-center text-center max-w-3xl z-40 px-4 w-full"
          >
            <div className="flex items-center gap-3 text-amber-300/80 mb-2">
              <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight drop-shadow-[0_0_35px_rgba(245,158,11,0.95)] leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500">
              HAPPY DIWALI!
            </h1>

            <p className="mt-4 text-base sm:text-xl md:text-2xl text-amber-100 font-light font-serif tracking-wide max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              "May your life shine with happiness, prosperity, and endless possibilities."
            </p>

            <p className="mt-2 text-xs sm:text-sm text-amber-300/70 tracking-widest uppercase">
              Shubh Deepavali • Festival of Victory & Illumination
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Launch Another Rocket</span>
              </button>

              {onNavigateToDiyas && (
                <button
                  onClick={onNavigateToDiyas}
                  className="px-6 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-400/40 text-amber-200 font-medium text-sm tracking-wide transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Light Sacred Diyas</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              )}

              {onNavigateToPlayground && (
                <button
                  onClick={onNavigateToPlayground}
                  className="px-6 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-400/40 text-amber-200 font-medium text-sm tracking-wide transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sky Fireworks Playground</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-md h-80 flex items-end justify-center z-20 pb-4">
        <div className="absolute bottom-0 w-72 h-14 flex items-center justify-center">
          <svg viewBox="0 0 280 50" fill="none" className="w-full h-full">
            <ellipse cx="140" cy="40" rx="120" ry="8" fill="#000000" opacity="0.6" />
            <path d="M40 40 L60 20 H220 L240 40 Z" fill="url(#platformBrass)" stroke="#b45309" strokeWidth="1" />
            <rect x="130" y="8" width="20" height="20" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
            <ellipse cx="140" cy="8" rx="10" ry="3" fill="#1e0b02" stroke="#ffd700" strokeWidth="1" />
            <defs>
              <linearGradient id="platformBrass" x1="40" y1="20" x2="240" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {stage !== 'exploded' && stage !== 'revealed' && (
          <div
            className="absolute bottom-10 flex flex-col items-center pointer-events-none transition-transform"
            style={{
              transform: `translate(${rocketX}px, ${rocketY}px) rotate(${rocketAngle}deg)`,
              transition: stage === 'launching' ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {stage === 'launching' && (
              <div className="absolute -bottom-24 w-12 h-36 flex flex-col items-center">
                <div 
                  className="w-8 h-28 rounded-full bg-gradient-to-t from-transparent via-orange-500 to-yellow-200 animate-pulse"
                  style={{
                    filter: 'drop-shadow(0 0 18px #ff7700)',
                    transform: 'scaleY(1.4)',
                  }}
                />
                <div className="w-16 h-12 rounded-full bg-amber-100/30 blur-md -mt-8" />
              </div>
            )}

            <svg
              viewBox="0 0 100 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 h-72 overflow-visible"
            >
              <defs>
                <linearGradient id="rocketBody" x1="30" y1="40" x2="70" y2="130" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="40%" stopColor="#b91c1c" />
                  <stop offset="70%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>

                <linearGradient id="rocketCone" x1="50" y1="5" x2="50" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                <linearGradient id="goldBand" x1="30" y1="60" x2="70" y2="60" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="50%" stopColor="#fffbeb" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              <rect x="52" y="120" width="3.5" height="115" rx="1.5" fill="#a16207" stroke="#713f12" strokeWidth="0.5" />
              <polygon points="50,5 30,40 70,40" fill="url(#rocketCone)" stroke="#ffd700" strokeWidth="1" />
              <rect x="30" y="40" width="40" height="85" rx="3" fill="url(#rocketBody)" stroke="#f59e0b" strokeWidth="1.2" />

              <rect x="30" y="55" width="40" height="8" fill="url(#goldBand)" />
              <rect x="30" y="105" width="40" height="6" fill="url(#goldBand)" />

              <text x="50" y="78" textAnchor="middle" fill="#fef08a" fontSize="7" fontWeight="bold" fontFamily="Cinzel, serif" letterSpacing="0.8">
                ROYAL
              </text>
              <text x="50" y="88" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="1">
                10,000x
              </text>
              <text x="50" y="98" textAnchor="middle" fill="#fed7aa" fontSize="6" fontWeight="medium">
                SKYBURST
              </text>

              <polygon points="36,125 64,125 58,132 42,132" fill="#451a03" stroke="#b45309" strokeWidth="1" />

              <path
                d="M50 132 C50 148 65 155 72 165 C76 170 82 174 88 174"
                stroke="#78716c"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {stage === 'igniting' && (
                <path
                  d="M50 132 C50 148 65 155 72 165 C76 170 82 174 88 174"
                  stroke="#ff5400"
                  strokeWidth="3"
                  strokeDasharray="60"
                  strokeDashoffset={fuseProgress * 60}
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 6px #ff5400)' }}
                />
              )}
            </svg>

            <div
              onClick={handleIgnite}
              className={`absolute bottom-20 right-4 w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-auto transition-transform ${
                stage === 'idle' ? 'hover:scale-125' : ''
              }`}
              title="Click here to ignite the fuse!"
            >
              {stage === 'idle' && (
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 animate-ping opacity-75" />
                  <div className="absolute w-5 h-5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 shadow-[0_0_12px_#f59e0b]" />
                  <Sparkles className="absolute w-6 h-6 text-yellow-100 animate-spin" />
                </div>
              )}

              {stage === 'igniting' && (
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white animate-ping opacity-90 shadow-[0_0_20px_#ffffff]" />
                  <div className="absolute w-6 h-6 rounded-full bg-amber-400 animate-spark shadow-[0_0_15px_#ff7700]" />
                  <div className="absolute -top-3 -right-2 w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
                  <div className="absolute -bottom-2 -left-3 w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {cursorPos && stage === 'idle' && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75 hidden md:block"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: 'translate(-10px, -50px)',
          }}
        >
          <div className="relative">
            <div className="w-1.5 h-14 bg-gradient-to-t from-stone-400 to-stone-200 rounded-full rotate-45 shadow-sm" />
            <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-amber-300 animate-ping opacity-75" />
            <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffd700]" />
          </div>
        </div>
      )}
    </div>
  );
};
