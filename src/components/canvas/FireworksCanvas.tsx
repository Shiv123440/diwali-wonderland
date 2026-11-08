import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { sound } from '../../services/audioEngine';

export type FireworkType = 'willow' | 'peony' | 'chrysanthemum' | 'heart' | 'ring' | 'stars';

export interface FireworksCanvasHandle {
  triggerExplosion: (x: number, y: number, type?: FireworkType, colorTheme?: string[]) => void;
  launchRocketTo: (targetX: number, targetY: number, type?: FireworkType) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  drag: number;
  sparkle: boolean;
  history: { x: number; y: number }[];
  maxHistory: number;
}

interface RocketParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  type: FireworkType;
  color: string;
  trail: { x: number; y: number }[];
}

interface FireworksCanvasProps {
  interactive?: boolean;
  ambientMode?: boolean;
  activeType?: FireworkType;
  onExplosion?: (count: number) => void;
}

const COLOR_PALETTES = {
  gold: ['#fff3c4', '#f59e0b', '#f3b43f', '#ffd700', '#ff9f1c'],
  royal: ['#ff4d6d', '#ff758f', '#9b5de5', '#00f5d4', '#f15bb5', '#fee440'],
  festival: ['#ff3366', '#ff9900', '#ffcc00', '#33ccff', '#cc33ff', '#33ff99'],
  peacock: ['#0077b6', '#00b4d8', '#90e0ef', '#06d6a0', '#ffd166'],
  ruby: ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'],
};

export const FireworksCanvas = forwardRef<FireworksCanvasHandle, FireworksCanvasProps>(
  ({ interactive = true, ambientMode = false, activeType = 'willow', onExplosion }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rocketsRef = useRef<RocketParticle[]>([]);
    const flashOpacityRef = useRef<number>(0);
    const explosionCountRef = useRef<number>(0);
    const animationFrameId = useRef<number | null>(null);

    const triggerFlash = (intensity: number = 0.25) => {
      flashOpacityRef.current = Math.min(flashOpacityRef.current + intensity, 0.6);
    };

    const createExplosion = (
      x: number,
      y: number,
      type: FireworkType = activeType,
      customPalette?: string[]
    ) => {
      const palette = customPalette || (
        type === 'willow' ? COLOR_PALETTES.gold :
        type === 'heart' ? COLOR_PALETTES.royal :
        type === 'ring' ? COLOR_PALETTES.peacock :
        type === 'chrysanthemum' ? COLOR_PALETTES.festival :
        COLOR_PALETTES.royal
      );

      triggerFlash(0.25);
      sound.playFireworkBurst(type === 'willow' || type === 'chrysanthemum' ? 'heavy' : 'medium');

      explosionCountRef.current++;
      if (onExplosion) {
        onExplosion(explosionCountRef.current);
      }

      const particleCount = type === 'willow' ? 180 : type === 'chrysanthemum' ? 220 : 150;

      for (let i = 0; i < particleCount; i++) {
        let vx = 0;
        let vy = 0;
        const speed = Math.random() * 5 + 2;
        const color = palette[Math.floor(Math.random() * palette.length)];

        if (type === 'heart') {
          const t = (Math.PI * 2 * i) / particleCount;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const spread = Math.random() * 0.2 + 0.2;
          vx = hx * spread * 0.35 + (Math.random() - 0.5) * 0.5;
          vy = hy * spread * 0.35 + (Math.random() - 0.5) * 0.5;
        } else if (type === 'ring') {
          if (i < particleCount * 0.7) {
            const angle = (Math.PI * 2 * i) / (particleCount * 0.7);
            const r = Math.random() * 1.5 + 4.5;
            vx = Math.cos(angle) * r;
            vy = Math.sin(angle) * (r * 0.4);
          } else {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 2.5;
            vx = Math.cos(angle) * r;
            vy = Math.sin(angle) * r;
          }
        } else {
          const angle = Math.random() * Math.PI * 2;
          const spreadSpeed = type === 'willow' ? Math.random() * 4.5 + 1.5 : speed;
          vx = Math.cos(angle) * spreadSpeed;
          vy = Math.sin(angle) * spreadSpeed;
        }

        particlesRef.current.push({
          x,
          y,
          vx,
          vy,
          alpha: 1,
          decay: type === 'willow' ? Math.random() * 0.007 + 0.006 : Math.random() * 0.015 + 0.012,
          color,
          size: type === 'willow' ? Math.random() * 2.5 + 1.2 : Math.random() * 3 + 1.5,
          gravity: type === 'willow' ? 0.045 : 0.065,
          drag: type === 'willow' ? 0.985 : 0.97,
          sparkle: type === 'chrysanthemum' || Math.random() > 0.45,
          history: [],
          maxHistory: type === 'willow' ? 6 : 3,
        });
      }
    };

    const launchRocket = (targetX: number, targetY: number, type: FireworkType = activeType) => {
      if (!canvasRef.current) return;
      const startX = targetX + (Math.random() - 0.5) * 60;
      const startY = canvasRef.current.height;
      
      const dx = targetX - startX;
      const dy = targetY - startY;
      const distance = Math.hypot(dx, dy);
      const speed = Math.max(12, distance / 35);
      
      const vx = (dx / distance) * speed;
      const vy = (dy / distance) * speed;

      sound.playRocketLaunch();

      rocketsRef.current.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        vx,
        vy,
        type,
        color: '#ffc83b',
        trail: [],
      });
    };

    useImperativeHandle(ref, () => ({
      triggerExplosion: (x: number, y: number, type = activeType, palette) => {
        createExplosion(x, y, type, palette);
      },
      launchRocketTo: (x: number, y: number, type = activeType) => {
        launchRocket(x, y, type);
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(dpr, dpr);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      const render = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(0, 0, width, height);

        if (flashOpacityRef.current > 0.01) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255, 230, 160, ${flashOpacityRef.current})`;
          ctx.fillRect(0, 0, width, height);
          flashOpacityRef.current *= 0.88;
        }

        ctx.globalCompositeOperation = 'lighter';

        for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
          const r = rocketsRef.current[i];
          r.trail.push({ x: r.x, y: r.y });
          if (r.trail.length > 8) r.trail.shift();

          r.x += r.vx;
          r.y += r.vy;

          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 180, 50, 0.7)';
          ctx.lineWidth = 2.5;
          for (let j = 0; j < r.trail.length; j++) {
            const pt = r.trail[j];
            if (j === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffaa00';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (r.y <= r.targetY || r.vy >= 0) {
            createExplosion(r.targetX, r.targetY, r.type);
            rocketsRef.current.splice(i, 1);
          }
        }

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];

          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > p.maxHistory) p.history.shift();

          p.vx *= p.drag;
          p.vy *= p.drag;
          p.vy += p.gravity;

          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          const alphaModifier = p.sparkle && Math.random() > 0.4 ? 0.3 : 1;
          const currentAlpha = Math.max(0, p.alpha * alphaModifier);

          if (p.history.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = currentAlpha * 0.4;
            ctx.lineWidth = p.size * 0.75;
            for (let k = 0; k < p.history.length; k++) {
              const h = p.history[k];
              if (k === 0) ctx.moveTo(h.x, h.y);
              else ctx.lineTo(h.x, h.y);
            }
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }

        animationFrameId.current = requestAnimationFrame(render);
      };

      animationFrameId.current = requestAnimationFrame(render);

      return () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        window.removeEventListener('resize', handleResize);
      };
    }, [activeType]);

    useEffect(() => {
      if (!ambientMode) return;

      const interval = setInterval(() => {
        const x = window.innerWidth * (0.15 + Math.random() * 0.7);
        const y = window.innerHeight * (0.15 + Math.random() * 0.35);
        const types: FireworkType[] = ['willow', 'peony', 'chrysanthemum', 'stars', 'ring'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        launchRocket(x, y, randomType);
      }, 4500);

      return () => clearInterval(interval);
    }, [ambientMode]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      launchRocket(x, y, activeType);
    };

    const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!interactive || !e.touches[0]) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      launchRocket(x, y, activeType);
    };

    return (
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasTouch}
        className="absolute inset-0 w-full h-full pointer-events-auto z-10"
        style={{ cursor: interactive ? 'crosshair' : 'default' }}
      />
    );
  }
);

FireworksCanvas.displayName = 'FireworksCanvas';
