import React from 'react';
import { VideoReelItem, LightboxMedia } from '../types';

interface TurntablesProps {
  items: VideoReelItem[];
  onOpenMedia: (media: LightboxMedia) => void;
}

export const Turntables: React.FC<TurntablesProps> = ({ items, onOpenMedia }) => {
  return (
    <section className="section section--ink chapter-live" id="reel">
      <div className="section__head ink-chapter ink-arrived" data-chapter="CHAPTER 02 · MOTION">
        <h2 className="section__title">Character Turntables</h2>
        <p className="section__sub">
          360-degree character presentation / motion panels from finished real-time work.
        </p>
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
