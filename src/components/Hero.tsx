import React from 'react';
import { LightboxMedia } from '../types';

interface HeroProps {
  onOpenMedia: (media: LightboxMedia) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenMedia }) => {
  const riftPaths = [
    'M310 350 L258 291 L276 246 L212 191 L231 145 L157 72 L170 0',
    'M310 350 L361 300 L352 259 L420 223 L407 163 L489 117 L510 0',
    'M310 350 L380 369 L416 345 L489 393 L550 367 L600 406',
    'M310 350 L277 406 L297 452 L222 511 L244 559 L153 623 L137 700',
    'M310 350 L367 424 L355 482 L437 533 L419 603 L487 700',
    'M310 350 L229 366 L193 337 L129 386 L91 368 L0 422',
    'M212 191 L166 207 L129 166 L61 177',
    'M420 223 L467 250 L511 219 L600 250',
    'M222 511 L162 496 L136 546 L60 566',
    'M437 533 L488 514 L531 560 L600 546',
    'M258 291 L213 267 L161 283',
    'M367 424 L420 450 L466 435',
  ];

  const fragments = Array.from({ length: 14 }).map((_, i) => {
    const a = i * 2.399;
    return {
      x: `${50 + Math.cos(a) * 48}%`,
      y: `${50 + Math.sin(a) * 45}%`,
      angle: `${i * 39}deg`,
      delay: `${-i * 0.71}s`,
      size: `${18 + (i % 4) * 12}px`,
    };
  });

  return (
    <section className="hero">
      <div className="jojo-hero-stamp" aria-hidden="true">
        <i></i> BIZARRE DIMENSION // PORTFOLIO 2026
      </div>

      <div className="hero__inner">
        <p className="hero__eyebrow">CHARACTER ART / FANTASY &amp; REAL-TIME</p>
        <h1 className="hero__title">
          Mohammad<strong>Iftequaruddin</strong>
        </h1>
        <p className="hero__lead">
          Game-ready character art with a strong stylized identity &mdash; sculpt, retopology, UV, texturing and rigging for real-time projects, Roblox UGC and production pipelines.
        </p>
        <div className="hero__cta">
          <a className="btn btn--solid" href="#work">Enter Portfolio</a>
          <a className="btn btn--ghost" href="#viewer">Inspect 3D</a>
          <a className="btn btn--ghost" href="/assets/CV.pdf" target="_blank" rel="noopener noreferrer">CV / PDF</a>
          <a className="btn btn--ghost" href="https://www.artstation.com" target="_blank" rel="noopener noreferrer">ArtStation &#8599;</a>
        </div>
      </div>

      <div className="hero__visual" aria-label="DIO featured character artwork">
        {/* Geometric ink rift fracture */}
        <div className="rift-scene" aria-hidden="true">
          <svg viewBox="0 0 600 700" preserveAspectRatio="none">
            {riftPaths.map((d, i) => (
              <path
                key={i}
                d={d}
                pathLength="1"
                style={{ '--delay': `${i * 0.065}s` } as React.CSSProperties}
              />
            ))}
          </svg>
          {fragments.map((f, i) => (
            <i
              key={i}
              className="rift-fragment"
              style={{
                '--x': f.x,
                '--y': f.y,
                '--angle': f.angle,
                '--delay': f.delay,
                '--size': f.size,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="ink-speedlines" aria-hidden="true"></div>

        <span className="hero__edition">ARTIST ARCHIVE / VOL. 01</span>
        <div className="hero__soundfx" aria-hidden="true">ゴゴゴ</div>
        <a 
          className="dio-cover" 
          href="#dio-feature" 
          aria-label="View DIO character turnaround"
        >
          <img 
            src="/assets/work/roblox-dio.png" 
            alt="DIO, a gold-haired stylized 3D character with violet skin and a white and gold outfit" 
            loading="eager"
            {...({ fetchpriority: 'high' } as any)}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/work/dio-turnaround.png';
            }}
          />
        </a>
        <div className="hero__caption">
          <span>FEATURED CHARACTER</span>
          <strong>DIO</strong>
          <a href="#dio-feature">EXPLORE ARTWORK &#8599;</a>
        </div>
        <span className="hero__seal" aria-hidden="true">
          立体<br />造形
        </span>
      </div>

      <div className="hero__scroll" aria-hidden="true">SCROLL TO CHAPTER 01</div>
    </section>
  );
};
