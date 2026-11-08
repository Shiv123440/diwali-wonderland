import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExperienceCanvas } from './components/world/ExperienceCanvas';
import { CameraPreset } from './components/cinematic/CameraController';
import { RocketState } from './components/rocket/RocketController';
import { FireworkExplosionEvent } from './components/rocket/ExplosionSystem';
import { SkyLantern } from './components/activities/FloatingLanterns';
import { IntroOverlay } from './components/ui/IntroOverlay';
import { TopNavbar } from './components/ui/TopNavbar';
import { BottomDock, ActiveActivity } from './components/ui/BottomDock';
import { RocketLaunchModal } from './components/ui/RocketLaunchModal';
import { GrandRevealBanner } from './components/ui/GrandRevealBanner';
import { DiyaCeremonyModal } from './components/ui/DiyaCeremonyModal';
import { FireworksModal, FireworkType } from './components/ui/FireworksModal';
import { SkyLanternModal } from './components/ui/SkyLanternModal';
import { RangoliModal } from './components/ui/RangoliModal';
import { GiftSurpriseModal } from './components/ui/GiftSurpriseModal';
import { GreetingCardModal } from './components/ui/GreetingCardModal';
import { audioManager } from './utils/audio';

export function App() {
  const [mode, setMode] = useState<'intro' | 'exploration' | 'rocket_launch' | 'celebration' | 'lantern_follow'>('intro');
  const [introProgress, setIntroProgress] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('courtyard');
  const [activeActivity, setActiveActivity] = useState<ActiveActivity>('none');

  const [quality, setQuality] = useState<'high' | 'medium'>('high');
  const [isMuted, setIsMuted] = useState(false);

  const [litDiyas, setLitDiyas] = useState<boolean[]>([
    true, true, true, true, false, false, false, false
  ]);

  const [rocketState, setRocketState] = useState<RocketState>('idle');
  const [showGrandReveal, setShowGrandReveal] = useState(false);

  const [explosions, setExplosions] = useState<FireworkExplosionEvent[]>([]);
  const [selectedFireworkType, setSelectedFireworkType] = useState<FireworkType>('gold');

  // Sky Lanterns & Camera Tracking
  const [trackedLantern, setTrackedLantern] = useState<SkyLantern | null>(null);
  const [lanterns, setLanterns] = useState<SkyLantern[]>([
    {
      id: 'l-init-1',
      initialPos: [-5, 8, -12],
      wish: 'Eternal Light & Harmony',
      sender: 'Palace Royal',
      createdAt: Date.now() - 6000,
      speed: 0.9,
      swayPhase: 0.5,
    },
    {
      id: 'l-init-2',
      initialPos: [4, 12, -10],
      wish: 'Health & Long Life',
      sender: 'Palace Royal',
      createdAt: Date.now() - 9000,
      speed: 1.1,
      swayPhase: 1.8,
    },
    {
      id: 'l-init-3',
      initialPos: [-2, 16, -18],
      wish: 'Prosperity & Grace',
      sender: 'Palace Royal',
      createdAt: Date.now() - 14000,
      speed: 0.8,
      swayPhase: 3.2,
    },
  ]);

  const [rangoliColors, setRangoliColors] = useState<string[]>([
    '#b81424',
    '#f59e0b',
    '#0077b6',
    '#10b981',
    '#ffffff',
  ]);
  const [rangoliPattern, setRangoliPattern] = useState('lotus');

  const triggerExplosion = useCallback(
    (pos: [number, number, number], type: FireworkType = 'gold', scale = 1.0) => {
      const newExp: FireworkExplosionEvent = {
        id: `exp-${Date.now()}-${Math.random()}`,
        position: pos,
        colorType: type,
        scale,
        createdAt: Date.now(),
      };
      setExplosions((prev) => [...prev, newExp]);
    },
    []
  );

  const handleExplosionComplete = useCallback((id: string) => {
    setExplosions((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleDiyaIgnited = useCallback(() => {
    const startTime = performance.now();
    const duration = 2500;
    const animateCamera = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setIntroProgress(eased);
      if (t < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    requestAnimationFrame(animateCamera);
  }, []);

  const handleEnterCelebration = () => {
    setMode('exploration');
    setIntroProgress(1);
    setCameraPreset('courtyard');
    audioManager.startAmbient();
  };

  const handleToggleDiya = (index: number) => {
    setShowGrandReveal(false);
    setLitDiyas((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      const litCount = next.filter(Boolean).length;
      if (litCount === next.length) {
        audioManager.playAllDiyasLit();
      }
      return next;
    });
  };

  const handleLightAllDiyas = () => {
    setShowGrandReveal(false);
    setLitDiyas(new Array(8).fill(true));
  };

  const handleIgniteRocket = () => {
    setShowGrandReveal(false);
    setMode('rocket_launch');
    setRocketState('burning');
  };

  const handleResetRocket = () => {
    setShowGrandReveal(false);
    setRocketState('idle');
    setMode('exploration');
    setCameraPreset('rocket');
  };

  const handleRocketExplode = (pos: [number, number, number]) => {
    // Crucial: Set camera preset to sky so the camera remains pointed high up at the night sky
    setCameraPreset('sky');
    setMode('celebration');
    triggerExplosion(pos, 'gold', 2.5);
    // Delay the banner slightly so the explosion shockwave and flash take center stage in the sky
    setTimeout(() => {
      setShowGrandReveal(true);
    }, 1100);
  };

  const backgroundFireworksRef = useRef<number | null>(null);
  useEffect(() => {
    if (mode === 'celebration') {
      const types: FireworkType[] = ['gold', 'ruby', 'emerald', 'peacock'];
      backgroundFireworksRef.current = window.setInterval(() => {
        const rx = (Math.random() - 0.5) * 45;
        const ry = 22 + Math.random() * 15;
        const rz = -20 - Math.random() * 25;
        const rType = types[Math.floor(Math.random() * types.length)];
        triggerExplosion([rx, ry, rz], rType, 0.9);
        audioManager.playFireworkExplosion('medium');
      }, 3200);
    } else {
      if (backgroundFireworksRef.current) {
        clearInterval(backgroundFireworksRef.current);
      }
    }
    return () => {
      if (backgroundFireworksRef.current) {
        clearInterval(backgroundFireworksRef.current);
      }
    };
  }, [mode, triggerExplosion]);

  const handleLaunchRandomFirework = () => {
    const rx = (Math.random() - 0.5) * 20;
    const ry = 20 + Math.random() * 12;
    const rz = -5 - Math.random() * 15;
    triggerExplosion([rx, ry, rz], selectedFireworkType, 1.3);
    audioManager.playFireworkExplosion('medium');
  };

  const handleLaunchSkyFirework = (pos: [number, number, number]) => {
    triggerExplosion(pos, selectedFireworkType, 1.2);
    audioManager.playFireworkExplosion('medium');
  };

  // When Sky Lantern(s) are released: create single or flock and focus camera on them!
  const handleReleaseLantern = (wish: string, sender: string, count: number = 1) => {
    const flockWishes = [
      wish,
      'Light, Love & Prosperity',
      'Peace across the Earth',
      'Good Health & Boundless Happiness',
      'Abundance, Wealth & Good Fortune',
      'Victory of Light over Darkness',
      'Success & New Beginnings',
      'Joy & Harmony for Every Home',
    ];

    const newLanterns: SkyLantern[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = count === 1 ? 0.4 : 1.2 + Math.random() * 2.2;
      const xOffset = count === 1 ? (Math.random() - 0.5) * 2.5 : Math.cos(angle) * radius;
      const zOffset = count === 1 ? (Math.random() - 0.5) * 2 + 1 : Math.sin(angle) * radius + 1;

      newLanterns.push({
        id: `lantern-${now}-${i}`,
        initialPos: [xOffset, 0.45 + i * 0.15, zOffset],
        wish: i === 0 ? wish : flockWishes[i % flockWishes.length],
        sender: sender || 'A Diwali Well-wisher',
        createdAt: now + i * 150,
        speed: 0.85 + Math.random() * 0.35,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    setLanterns((prev) => [...prev, ...newLanterns]);
    // Follow the primary released lantern
    setTrackedLantern(newLanterns[0]);
    setMode('lantern_follow');
  };

  // When user drags/touches the screen, clear lantern lock
  const handleUserInteracted = () => {
    if (mode === 'lantern_follow') {
      setTrackedLantern(null);
      setMode('exploration');
    }
  };

  const handleChangeRangoliColor = (index: number, newColor: string) => {
    setRangoliColors((prev) => {
      const next = [...prev];
      next[index] = newColor;
      return next;
    });
  };

  const handleReplayIntro = () => {
    setMode('intro');
    setIntroProgress(0);
    setActiveActivity('none');
    setShowGrandReveal(false);
    setTrackedLantern(null);
  };

  const litCount = litDiyas.filter(Boolean).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05060f] select-none">
      <ExperienceCanvas
        mode={mode}
        cameraPreset={cameraPreset}
        litDiyas={litDiyas}
        onToggleDiya={handleToggleDiya}
        rocketState={rocketState}
        onRocketStateChange={setRocketState}
        onRocketExplode={handleRocketExplode}
        explosions={explosions}
        onExplosionComplete={handleExplosionComplete}
        lanterns={lanterns}
        trackedLantern={trackedLantern}
        onUserInteracted={handleUserInteracted}
        onOpenGiftModal={() => setActiveActivity('surprise')}
        onOpenRangoliModal={() => {
          setActiveActivity('rangoli');
          setCameraPreset('rangoli');
        }}
        onLaunchSkyFirework={handleLaunchSkyFirework}
        introProgress={introProgress}
        quality={quality}
        rangoliColors={rangoliColors}
        rangoliPattern={rangoliPattern}
      />

      {mode === 'intro' && (
        <IntroOverlay
          onEnter={handleEnterCelebration}
          onDiyaIgnited={handleDiyaIgnited}
        />
      )}

      {mode !== 'intro' && (
        <TopNavbar
          currentPreset={cameraPreset}
          onSelectPreset={(p: CameraPreset) => {
            setShowGrandReveal(false);
            setTrackedLantern(null);
            setMode('exploration');
            setCameraPreset(p);
            if (p === 'rocket') {
              setActiveActivity('rocket');
            } else if (p === 'altar') {
              setActiveActivity('diya');
            } else if (p === 'rangoli') {
              setActiveActivity('rangoli');
            }
          }}
          isMuted={isMuted}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            audioManager.setMute(next);
          }}
          onReplayIntro={handleReplayIntro}
          quality={quality}
          onToggleQuality={() =>
            setQuality((q: 'high' | 'medium') => (q === 'high' ? 'medium' : 'high'))
          }
        />
      )}

      {mode !== 'intro' && (
        <BottomDock
          activeActivity={activeActivity}
          onSelectActivity={(act: ActiveActivity) => {
            setShowGrandReveal(false);
            setActiveActivity(act);
            setTrackedLantern(null);
            setMode('exploration');

            if (act === 'rocket') {
              setCameraPreset('rocket');
            } else if (act === 'diya') {
              setCameraPreset('altar');
            } else if (act === 'fireworks') {
              setCameraPreset('sky');
            } else if (act === 'rangoli') {
              setCameraPreset('rangoli');
            }
          }}
          litDiyasCount={litCount}
          totalDiyas={litDiyas.length}
        />
      )}

      {activeActivity === 'rocket' && (
        <RocketLaunchModal
          rocketState={rocketState}
          onIgnite={handleIgniteRocket}
          onReset={handleResetRocket}
          onClose={() => setActiveActivity('none')}
        />
      )}

      {activeActivity === 'diya' && (
        <DiyaCeremonyModal
          litDiyas={litDiyas}
          onLightAll={handleLightAllDiyas}
          onToggleDiya={handleToggleDiya}
          onClose={() => setActiveActivity('none')}
        />
      )}

      {activeActivity === 'fireworks' && (
        <FireworksModal
          selectedType={selectedFireworkType}
          onSelectType={setSelectedFireworkType}
          onLaunchRandom={handleLaunchRandomFirework}
          onClose={() => setActiveActivity('none')}
        />
      )}

      {activeActivity === 'lanterns' && (
        <SkyLanternModal
          onRelease={handleReleaseLantern}
          onClose={() => setActiveActivity('none')}
          lanternsCount={lanterns.length}
        />
      )}

      {activeActivity === 'rangoli' && (
        <RangoliModal
          colors={rangoliColors}
          onChangeColor={handleChangeRangoliColor}
          patternName={rangoliPattern}
          onChangePattern={setRangoliPattern}
          onClose={() => setActiveActivity('none')}
        />
      )}

      {activeActivity === 'surprise' && (
        <GiftSurpriseModal
          onClose={() => setActiveActivity('none')}
          onOpenGreeting={() => setActiveActivity('greeting')}
        />
      )}

      {activeActivity === 'greeting' && (
        <GreetingCardModal onClose={() => setActiveActivity('none')} />
      )}

      {showGrandReveal && (
        <GrandRevealBanner
          onReLaunch={() => {
            setShowGrandReveal(false);
            handleResetRocket();
            setTimeout(() => {
              handleIgniteRocket();
            }, 300);
          }}
          onOpenGreeting={() => {
            setShowGrandReveal(false);
            setActiveActivity('greeting');
          }}
          onDismiss={() => setShowGrandReveal(false)}
        />
      )}
    </div>
  );
}

export default App;
