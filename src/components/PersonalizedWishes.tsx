import React, { useState, useRef } from 'react';
import { Download, Copy, Check, Send, Share2 } from 'lucide-react';
import { DiyaIllustration } from './common/DiyaIllustration';
import { sound } from '../services/audioEngine';

const WISH_TEMPLATES = [
  {
    title: 'Divine & Prosperous',
    quote: 'May the radiant divine light of Diwali illuminate your soul, banish all darkness, and usher in eternal health, boundless prosperity, and joyful peace into your cherished home.',
  },
  {
    title: 'Warm & Familial',
    quote: 'Wishing you and your loving family a Diwali overflowing with radiant diyas, laughter that echoes through the house, sweet mithai delicacies, and memorable moments to cherish forever.',
  },
  {
    title: 'Success & Ambition',
    quote: 'As glorious fireworks light up the celestial heavens, may your dreams ignite into dazzling victories, breakthroughs, and unprecedented milestones in the coming auspicious year.',
  },
];

export const PersonalizedWishes: React.FC = () => {
  const [senderName, setSenderName] = useState<string>('Shiv');
  const [recipientName, setRecipientName] = useState<string>('Dear Friends & Family');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const currentWish = WISH_TEMPLATES[selectedTemplateIndex].quote;

  const getShareUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    if (senderName) url.searchParams.set('from', senderName.trim());
    if (recipientName) url.searchParams.set('to', recipientName.trim());
    return url.toString();
  };

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(getShareUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = () => {
    sound.playClick();
    const formatted = `🪔✨ HAPPY DIWALI ✨🪔\n\nTo ${recipientName},\n\n"${currentWish}"\n\nWith warm festive regards,\n${senderName}\n\nExperience our interactive Diwali Wonderland celebration here: ${getShareUrl()}`;
    navigator.clipboard.writeText(formatted);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadCard = () => {
    sound.playGiftOpen();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgGrad = ctx.createRadialGradient(600, 350, 50, 600, 350, 650);
    bgGrad.addColorStop(0, '#1c1538');
    bgGrad.addColorStop(0.6, '#0b0e26');
    bgGrad.addColorStop(1, '#030511');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 700);

    ctx.strokeStyle = '#f3b43f';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 640);

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(45, 45, 1110, 610);
    ctx.setLineDash([]);

    const corners = [
      { x: 50, y: 50 },
      { x: 1150, y: 50 },
      { x: 50, y: 650 },
      { x: 1150, y: 650 },
    ];
    corners.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    });

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIWALI WONDERLAND', 600, 110);

    const textGrad = ctx.createLinearGradient(400, 150, 800, 210);
    textGrad.addColorStop(0, '#ffffff');
    textGrad.addColorStop(0.5, '#fef08a');
    textGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = textGrad;
    ctx.font = 'bold 56px "Cinzel", Georgia, serif';
    ctx.fillText('HAPPY DIWALI', 600, 200);

    ctx.fillStyle = '#fcd34d';
    ctx.font = 'italic 28px Georgia, serif';
    ctx.fillText(`To: ${recipientName}`, 600, 270);

    ctx.fillStyle = '#fef3c7';
    ctx.font = '22px "Outfit", sans-serif';
    const words = currentWish.split(' ');
    let line = '';
    let y = 350;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 900 && n > 0) {
        ctx.fillText(line, 600, y);
        line = words[n] + ' ';
        y += 36;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 600, y);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 28px "Cinzel", Georgia, serif';
    ctx.fillText(`With Blessings From: ${senderName}`, 600, 580);

    const link = document.createElement('a');
    link.download = `diwali-card-${senderName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="relative w-full h-full min-h-[85vh] flex flex-col items-center justify-between px-4 py-8 select-none z-20">
      <div className="flex flex-col items-center text-center max-w-md mb-2">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md mb-2">
          <Send className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
            Subhkamnayein Card Studio
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
          Personalise & Share Diwali Greetings
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mt-1">
          Craft a bespoke luxury greeting card for your loved ones, download it as a keepsake, or send a live celebration link.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-4">
        <div className="lg:col-span-5 flex flex-col gap-4 p-5 rounded-3xl bg-slate-950/75 border border-amber-500/25 backdrop-blur-md shadow-xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
              Your Name (Sender)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Shiv & Family"
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
              Wishing To (Recipient)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Sharma Family, Dearest Priya"
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
              Choose Blessing Theme
            </label>
            <div className="flex flex-col gap-1.5">
              {WISH_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={tmpl.title}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTemplateIndex(idx);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedTemplateIndex === idx
                      ? 'bg-amber-500/20 border border-amber-400/60 text-amber-200 font-semibold'
                      : 'bg-slate-900/60 text-amber-300/60 hover:text-amber-200'
                  }`}
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            ref={cardRef}
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181238] via-[#0e1029] to-[#040612] border-2 border-amber-400/40 shadow-[0_0_50px_rgba(243,180,63,0.25)] text-center space-y-4 overflow-hidden"
          >
            <div className="absolute inset-2.5 rounded-2xl border border-amber-400/25 border-dashed pointer-events-none" />

            <div className="flex justify-center -mt-2">
              <DiyaIllustration size="sm" isLit={true} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
                Shubh Deepavali
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                HAPPY DIWALI
              </h3>
              <p className="text-xs sm:text-sm font-serif italic text-amber-300/90 font-medium">
                To {recipientName || 'Dear Friends'}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-amber-100/90 font-light leading-relaxed px-2">
              "{currentWish}"
            </p>

            <div className="pt-2 border-t border-amber-500/20">
              <span className="text-[10px] text-amber-300/60 uppercase tracking-widest block">
                Warmest Festive Wishes From
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-amber-200">
                {senderName || 'A Well-Wisher'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleDownloadCard}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Card PNG</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-400/30 text-amber-200 text-xs font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Wish Copied!' : 'Copy Text Wish'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-400/30 text-amber-200 text-xs font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Web Link'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
};
