import React from 'react';
import { VideoReelItem, LightboxMedia } from '../types';

interface UnitySectionProps {
  items: VideoReelItem[];
  onOpenMedia: (media: LightboxMedia) => void;
}

export const UnitySection: React.FC<UnitySectionProps> = ({ items, onOpenMedia }) => {
  return (
    <section className="section" id="unity">
      <div className="section__head ink-chapter ink-arrived" data-chapter="CHAPTER 05 · REAL-TIME ENGINE">
        <h2 className="section__title">Unity</h2>
        <p className="section__sub">Real-time avatar integration and animation tests inside Unity.</p>
      </div>

      <div className="reel-grid">
        {items.map((item, idx) => (
          <figure
            key={idx}
            className="reel-card manga-pending manga-in"
            tabIndex={0}
            role="button"
            aria-label={`Open ${item.caption}`}
            onClick={() => onOpenMedia({ type: 'video', src: item.src, title: item.caption })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenMedia({ type: 'video', src: item.src, title: item.caption });
              }
            }}
          >
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
