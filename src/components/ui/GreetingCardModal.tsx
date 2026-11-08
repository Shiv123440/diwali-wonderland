import React, { useState } from 'react';
import { Mail, Copy, Check, X } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface GreetingCardModalProps {
  onClose: () => void;
}

export const GreetingCardModal: React.FC<GreetingCardModalProps> = ({ onClose }) => {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const presetMessages = [
    'May the divine glow of diyas illuminate your life with infinite joy, good health, peace and enduring prosperity.',
    'Wishing you and your family a magnificent Diwali filled with sweet memories, sparkling laughter, and boundless abundance.',
    'May Goddess Lakshmi bless your home with fortune and Lord Ganesha remove every obstacle from your sacred path.',
  ];

  const fullGreetingText = `🪔 *HAPPY DIWALI* 🪔\n\nDear ${recipientName || 'Dear One'},\n\n${presetMessages[messageIndex]}\n\nWith warmest festive blessings,\n*${senderName || 'Your Well-wisher'}*\n\n✨ Celebrate in 3D at Diwali Wonderland ✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullGreetingText);
    audioManager.playDiyaLight();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div className="pointer-events-auto max-w-xl w-full glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/50 shadow-[0_0_60px_rgba(245,158,11,0.35)] backdrop-blur-2xl animate-fade-in relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-amber-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-amber-400/20 mb-5">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
            <Mail className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-amber-200">
              ROYAL GREETING CARD STUDIO
            </h3>
            <p className="text-xs text-amber-400/70">
              Personalized Diwali Greetings for Loved Ones
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-[11px] font-cinzel text-amber-300 block mb-1">
              RECIPIENT NAME:
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Grandma, Rohit, Verma Family"
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950/60 border border-amber-400/30 text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-cinzel text-amber-300 block mb-1">
              SENDER NAME (YOUR NAME):
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Priya, Aarav"
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950/60 border border-amber-400/30 text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="text-[11px] font-cinzel text-amber-300 block mb-1.5">
            SELECT FESTIVE BLESSING:
          </label>
          <div className="space-y-1.5">
            {presetMessages.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => setMessageIndex(idx)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                  messageIndex === idx
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                    : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#090c21] border-2 border-amber-400/40 shadow-inner text-center relative overflow-hidden mb-5">
          <div className="absolute top-2 left-2 text-amber-400/40 text-xs">❖</div>
          <div className="absolute top-2 right-2 text-amber-400/40 text-xs">❖</div>
          <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs">❖</div>
          <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs">❖</div>

          <p className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 uppercase mb-2">
            शुभ दीपावली • SHUBH DEEPAWALI
          </p>

          <h4 className="text-2xl font-cinzel font-bold text-amber-200 mb-2">
            HAPPY DIWALI
          </h4>

          {recipientName && (
            <p className="text-xs font-cinzelText text-amber-300 mb-3">
              To: {recipientName}
            </p>
          )}

          <p className="text-xs font-serif italic text-amber-100/90 leading-relaxed mb-4 max-w-sm mx-auto">
            "{presetMessages[messageIndex]}"
          </p>

          <div className="w-16 h-0.5 bg-amber-400/40 mx-auto mb-3" />

          <p className="text-[11px] font-cinzelText text-amber-300">
            With Love & Blessings,
            <br />
            <span className="font-bold text-amber-200">{senderName || 'Your Well-wisher'}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-diya-glow transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-neutral-950" />
                COPIED TO CLIPBOARD!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-950" />
                COPY WHATSAPP MESSAGE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
