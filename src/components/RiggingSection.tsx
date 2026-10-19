import React from 'react';
import { RigItem, LightboxMedia } from '../types';

interface RiggingSectionProps {
  items: RigItem[];
  onOpenMedia: (media: LightboxMedia) => void;
}

export const RiggingSection: React.FC<RiggingSectionProps> = ({ items, onOpenMedia }) => {
  return (
    <section className="section section--ink chapter-live" id="rigging">
      <div className="section__head ink-chapter ink-arrived" data-chapter="CHAPTER 04 · RIG / ANIMATION">
        <h2 className="section__title">Rigging &amp; Animation</h2>
        <p className="section__sub">
          Production rigging, animation and VTuber systems / built to move, deform and ship.
        </p>
      </div>

      <div className="reel-grid">
        {items.map((item, idx) => {
          if (item.type === 'image') {
            return (
              <figure
                key={idx}
                className="card reveal is-in"
                tabIndex={0}
                role="button"
                aria-label={`Open ${item.title}`}
                onClick={() => onOpenMedia({ type: 'image', src: item.full || item.src, title: item.title })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenMedia({ type: 'image', src: item.full || item.src, title: item.title });
                  }
                }}
              >
                <img className="card__img" src={item.src} alt={item.title} loading="lazy" />
                <figcaption className="card__overlay">
                  <div className="card__title">{item.title}</div>
                  <div className="card__tags">{item.tags}</div>
                </figcaption>
              </figure>
            );
          }

          return (
            <figure
              key={idx}
              className="reel-card manga-pending manga-in"
              tabIndex={0}
              role="button"
              aria-label={`Open ${item.title}`}
              onClick={() => onOpenMedia({ type: 'video', src: item.src, title: item.title })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenMedia({ type: 'video', src: item.src, title: item.title });
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
              <figcaption>{item.title}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
};
