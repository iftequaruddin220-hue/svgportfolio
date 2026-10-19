import React, { useEffect, useRef, useState, useCallback } from 'react';

interface WhisperItem {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const MotionEffects: React.FC = () => {
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isMotionEnabled, setIsMotionEnabled] = useState<boolean>(true);
  const [whispers, setWhispers] = useState<WhisperItem[]>([]);

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  // Toggle Motion
  useEffect(() => {
    document.body.classList.toggle('rift-paused', !isMotionEnabled);
  }, [isMotionEnabled]);

  // Audio setup
  const ensureAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.gain.value = 0.55;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 18;
    comp.ratio.value = 4;
    comp.attack.value = 0.006;
    comp.release.value = 0.18;

    master.connect(comp).connect(ctx.destination);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = Math.random() * 2 - 1;
    }

    audioCtxRef.current = ctx;
    masterGainRef.current = master;
    noiseBufferRef.current = noiseBuffer;
  }, []);

  const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

  const triggerKick = useCallback(() => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const t = ctx.currentTime;
    o.type = 'sine';
    o.frequency.setValueAtTime(145, t);
    o.frequency.exponentialRampToValueAtTime(44, t + 0.17);
    g.gain.setValueAtTime(0.24, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.19);

    document.body.classList.add('jojo-beat');
    setTimeout(() => document.body.classList.remove('jojo-beat'), 92);
  }, []);

  const triggerTone = useCallback(
    (m: number, d = 0.16, w: OscillatorType = 'sawtooth', v = 0.035, cut = 1500) => {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      const o = ctx.createOscillator();
      const f = ctx.createBiquadFilter();
      const g = ctx.createGain();
      const t = ctx.currentTime;
      o.type = w;
      o.frequency.value = hz(m);
      f.type = 'lowpass';
      f.frequency.value = cut;
      f.Q.value = 2.2;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(f).connect(g).connect(master);
      o.start(t);
      o.stop(t + d + 0.03);
    },
    []
  );

  const triggerNoise = useCallback(
    (d = 0.08, v = 0.028, cut = 5000, type: BiquadFilterType = 'highpass') => {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      const noiseBuffer = noiseBufferRef.current;
      if (!ctx || !master || !noiseBuffer) return;

      const s = ctx.createBufferSource();
      const f = ctx.createBiquadFilter();
      const g = ctx.createGain();
      const t = ctx.currentTime;
      s.buffer = noiseBuffer;
      f.type = type;
      f.frequency.value = cut;
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      s.connect(f).connect(g).connect(master);
      s.start(t);
      s.stop(t + d + 0.01);
    },
    []
  );

  const bass = [38, 38, 41, 38, 36, 36, 41, 43, 38, 38, 45, 43, 36, 36, 33, 37];
  const arp = [62, 65, 69, 72, 65, 69, 74, 72, 62, 67, 70, 74, 65, 69, 72, 77];

  const musicStep = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const step = stepRef.current;

    if ([0, 4, 8, 12].includes(step)) triggerKick();
    if ([4, 12].includes(step)) triggerNoise(0.14, 0.05, 900, 'bandpass');
    triggerNoise(0.035, step % 2 ? 0.012 : 0.02, 6200, 'highpass');
    triggerTone(bass[step], 0.2, 'square', 0.028, 520);
    triggerTone(arp[step], 0.095, step % 4 === 0 ? 'sawtooth' : 'triangle', 0.018, 2400);

    if (step === 0 || step === 8) {
      [50, 53, 57].forEach((n, i) =>
        setTimeout(() => triggerTone(n, 0.55, 'sawtooth', 0.009, 900 + i * 180), i * 8)
      );
    }

    stepRef.current = (step + 1) % 16;
  }, [triggerKick, triggerNoise, triggerTone]);

  const startMusic = useCallback(async () => {
    ensureAudio();
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    if (timerRef.current) return;
    stepRef.current = 0;
    musicStep();
    const tempo = 138;
    const stepMs = 60000 / tempo / 2;
    timerRef.current = window.setInterval(musicStep, stepMs);
    setIsPlayingMusic(true);
  }, [ensureAudio, musicStep]);

  const stopMusic = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.04);
      setTimeout(() => {
        if (masterGainRef.current) masterGainRef.current.gain.value = 0.55;
      }, 120);
    }
    setIsPlayingMusic(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (timerRef.current) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [startMusic, stopMusic]);

  // Keyboard shortcut 'M' for music
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'm' || e.key === 'M') &&
        !/INPUT|TEXTAREA/.test((document.activeElement?.tagName || ''))
      ) {
        e.preventDefault();
        toggleMusic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMusic]);

  // Impact and whisper effects on click
  const triggerImpact = useCallback((x: number, y: number) => {
    const words = ['ゴゴゴ', 'ドドド', 'ズキュン', 'バァン'];
    document.body.classList.remove('jojo-impact');
    void document.body.offsetWidth;
    document.body.classList.add('jojo-impact');
    setTimeout(() => document.body.classList.remove('jojo-impact'), 390);

    const newWhisper: WhisperItem = {
      id: Date.now() + Math.random(),
      text: words[Math.floor(Math.random() * words.length)],
      x: Math.max(10, Math.min(window.innerWidth - 170, x - 45)),
      y: Math.max(80, Math.min(window.innerHeight - 100, y - 40)),
    };

    setWhispers((prev) => [...prev, newWhisper]);
    setTimeout(() => {
      setWhispers((prev) => prev.filter((w) => w.id !== newWhisper.id));
    }, 1300);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('.card, .reel-card, .btn, .vbtn, .charbtn, .nav__links a') &&
        !target?.closest('.jojo-music, .motion-control')
      ) {
        triggerImpact(e.clientX, e.clientY);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [triggerImpact]);

  // Pointer position tracking for JoJo aura
  useEffect(() => {
    let raf = 0;
    const handlePointerMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.body.style.setProperty('--jx', `${((e.clientX / window.innerWidth) * 100).toFixed(1)}%`);
        document.body.style.setProperty('--jy', `${((e.clientY / window.innerHeight) * 100).toFixed(1)}%`);
        raf = 0;
      });
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <>
      {/* JoJo Background Visual Layers */}
      <div className="jojo-aura" aria-hidden="true" />
      <div className="jojo-speedlines" aria-hidden="true" />
      <div className="jojo-vignette" aria-hidden="true" />

      {/* Manga sound FX whisper overlays */}
      {whispers.map((w) => (
        <b
          key={w.id}
          className="jojo-whisper"
          style={{ left: `${w.x}px`, top: `${w.y}px` }}
        >
          {w.text}
        </b>
      ))}

      {/* Stand Console */}
      <aside className="stand-console" aria-label="Artist power profile">
        <div className="stand-console__head">
          <b>POLYGON SOUL</b>
          <span>STAND PROFILE</span>
        </div>
        <div className="stand-stat">
          <span>Modeling</span>
          <i style={{ '--stat': '96%' } as React.CSSProperties} />
          <b>A</b>
        </div>
        <div className="stand-stat">
          <span>Rigging</span>
          <i style={{ '--stat': '88%' } as React.CSSProperties} />
          <b>A</b>
        </div>
        <div className="stand-stat">
          <span>Style</span>
          <i style={{ '--stat': '100%' } as React.CSSProperties} />
          <b>&infin;</b>
        </div>
      </aside>

      {/* Music Controller */}
      <button
        className={`jojo-music ${isPlayingMusic ? 'is-playing' : ''}`}
        type="button"
        aria-pressed={isPlayingMusic}
        onClick={toggleMusic}
      >
        <span className="jojo-eq" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </span>
        <span>
          <b>{isPlayingMusic ? 'MUSIC // ON' : 'MUSIC // OFF'}</b>
          <small>ORIGINAL BIZARRE BATTLE THEME (PRESS M)</small>
        </span>
      </button>

      {/* Motion Controller */}
      <button
        type="button"
        className="motion-control"
        aria-label="Toggle decorative animation"
        aria-pressed={isMotionEnabled}
        onClick={() => setIsMotionEnabled(!isMotionEnabled)}
      >
        Motion: {isMotionEnabled ? 'On' : 'Off'}
      </button>
    </>
  );
};
