import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sparkles, Download, RotateCcw } from 'lucide-react';
import { sound } from '../services/audioEngine';

const RANGOLI_COLORS = [
  { name: 'Haldi Gold', hex: '#ffd700' },
  { name: 'Kumkum Red', hex: '#e63946' },
  { name: 'Rani Pink', hex: '#ff4d6d' },
  { name: 'Peacock Cyan', hex: '#00b4d8' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Royal Violet', hex: '#9b5de5' },
  { name: 'Saffron Orange', hex: '#ff7700' },
  { name: 'Sacred White', hex: '#ffffff' },
];

export const RangoliStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(RANGOLI_COLORS[0].hex);
  const [brushSize] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [symmetryPoints] = useState<number>(8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 500;

    drawBackgroundAndGrid(ctx, canvas.width, canvas.height);
    drawDefaultLotusPattern(ctx, canvas.width / 2, canvas.height / 2);
  }, []);

  const drawBackgroundAndGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#090b1c';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    ctx.strokeStyle = 'rgba(243, 180, 63, 0.12)';
    ctx.lineWidth = 1;

    [60, 110, 160, 210].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.setLineDash([3, 4]);
    for (let i = 0; i < symmetryPoints; i++) {
      const angle = (Math.PI * 2 * i) / symmetryPoints;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 220, cy + Math.sin(angle) * 220);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const drawDefaultLotusPattern = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    ctx.save();
    ctx.shadowBlur = 8;

    ctx.shadowColor = '#ffd700';
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    const petals = 8;
    for (let i = 0; i < petals; i++) {
      const angle = (Math.PI * 2 * i) / petals;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.bezierCurveTo(18, 40, 18, 70, 0, 90);
      ctx.bezierCurveTo(-18, 70, -18, 40, 0, 16);
      ctx.fillStyle = '#e63946';
      ctx.shadowColor = '#e63946';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 50);
      ctx.bezierCurveTo(28, 80, 24, 130, 0, 150);
      ctx.bezierCurveTo(-24, 130, -28, 80, 0, 50);
      ctx.fillStyle = '#ff4d6d';
      ctx.shadowColor = '#ff4d6d';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 158, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  };

  const drawSymmetricStroke = (fromX: number, fromY: number, toX: number, toY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = 6;

    for (let i = 0; i < symmetryPoints; i++) {
      const angle = (Math.PI * 2 * i) / symmetryPoints;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const p1x = fromX - cx;
      const p1y = fromY - cy;
      const p2x = toX - cx;
      const p2y = toY - cy;

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();

      ctx.scale(1, -1);
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  };

  const handleStart = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setLastPos({ x, y });
    drawSymmetricStroke(x, y, x + 0.1, y + 0.1);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !lastPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    drawSymmetricStroke(lastPos.x, lastPos.y, x, y);
    setLastPos({ x, y });
  };

  const handleEnd = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const handleAddGlitter = () => {
    sound.playDiyaLight();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 210;
      const x = canvas.width / 2 + Math.cos(angle) * radius;
      const y = canvas.height / 2 + Math.sin(angle) * radius;
      const size = Math.random() * 2 + 1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? '#ffd700' : '#ffffff';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.restore();
  };

  const handleClear = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBackgroundAndGrid(ctx, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    sound.playGiftOpen();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `diwali-wonderland-rangoli-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="relative w-full h-full min-h-[85vh] flex flex-col items-center justify-between px-4 py-8 select-none z-20">
      <div className="flex flex-col items-center text-center max-w-lg mb-2">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md mb-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
            Rangavali Studio
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
          Design Your Sacred Diwali Rangoli
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mt-1">
          Draw freely—our 8-fold radial symmetry engine blossoms every single stroke into a balanced sacred mandala.
        </p>
      </div>

      <div className="relative p-2 sm:p-3 rounded-3xl bg-slate-950/80 border border-amber-500/30 shadow-[0_0_40px_rgba(243,180,63,0.2)]">
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handleEnd}
          className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] rounded-2xl cursor-crosshair touch-none shadow-inner"
        />
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-3 mt-4">
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-slate-950/80 border border-amber-500/25 backdrop-blur-md shadow-lg">
          {RANGOLI_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                sound.playClick();
                setSelectedColor(c.hex);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform ${
                selectedColor === c.hex ? 'scale-125 ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'hover:scale-110 opacity-80'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleAddGlitter}
            className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Golden Dust</span>
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/20 text-amber-300/80 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Rangoli</span>
          </button>
        </div>
      </div>
    </div>
  );
};
