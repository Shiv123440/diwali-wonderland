import React from 'react';
import { Rocket, Sparkles, X, RotateCcw } from 'lucide-react';
import { RocketState } from '../rocket/RocketController';

interface RocketLaunchModalProps {
  rocketState: RocketState;
  onIgnite: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const RocketLaunchModal: React.FC<RocketLaunchModalProps> = ({
  rocketState,
  onIgnite,
  onReset,
  onClose,
}) => {
  return (
    <div className="fixed top-20 right-4 sm:right-8 z-40 max-w-sm w-full glass-panel p-5 rounded-2xl border border-amber-400/40 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
            <Rocket className="w-4 h-4 text-amber-300" />
          </div>
          <h2 className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
            ROYAL ROCKET LAUNCH
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-amber-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {rocketState === 'idle' && (
          <>
            <div>
              <p className="text-sm font-serif text-amber-100 font-medium">
                READY TO LIGHT UP THE SKY?
              </p>
              <p className="text-xs text-neutral-300 mt-1">
                Trigger the traditional braided fuse to launch the royal sky rocket.
              </p>
            </div>

            <button
              onClick={onIgnite}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-cinzel font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              IGNITE THE ROCKET
              <Sparkles className="w-4 h-4 animate-spin" />
            </button>
          </>
        )}

        {rocketState === 'burning' && (
          <div className="text-center py-2 space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-cinzel font-bold text-amber-300 tracking-wider">
              FUSE SIZZLING...
            </p>
            <p className="text-xs text-amber-100/70">
              Sparks traveling down the wick. Stand by for liftoff!
            </p>
          </div>
        )}

        {rocketState === 'launching' && (
          <div className="text-center py-2 space-y-3">
            <div className="flex justify-center">
              <Rocket className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
            <p className="text-sm font-cinzel font-bold text-amber-300 tracking-wider">
              ROCKET SOARING INTO STRATOSPHERE!
            </p>
            <p className="text-xs text-amber-100/70">
              Camera tracking vertical flight. Watch the night sky!
            </p>
          </div>
        )}

        {rocketState === 'exploded' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl text-center">
              <p className="text-xs text-amber-300 font-cinzel font-bold">
                EXPLOSION AT APEX
              </p>
              <p className="text-[11px] text-amber-100/80 mt-1">
                Grand celebration unlocked in the heavens!
              </p>
            </div>

            <button
              onClick={onReset}
              className="w-full py-2.5 px-4 rounded-xl glass-panel-subtle text-amber-200 border border-amber-400/30 font-cinzel text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RE-ARM ANOTHER ROCKET
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
