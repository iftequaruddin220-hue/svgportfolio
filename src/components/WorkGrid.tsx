import React from 'react';
import { WorkCategory, LightboxMedia } from '../types';

interface WorkGridProps {
  categories: WorkCategory[];
  onOpenMedia: (media: LightboxMedia) => void;
}

export const WorkGrid: React.FC<WorkGridProps> = ({ categories, onOpenMedia }) => {
  return (
    <>
      {categories.map((cat) => (
        <div className="cat reveal is-in" key={cat.name}>
          <h3 className="cat__title">
            {cat.name} <span className="cat__count">{cat.items.length}</span>
          </h3>
          <div className="grid">
            {cat.items.map((item, idx) => (
              <figure
                className="card reveal is-in"
                key={`${cat.name}-${idx}`}
                tabIndex={0}
                role="button"
                aria-label={`Open ${item.title}`}
                onClick={() =>
                  onOpenMedia({
                    type: 'image',
                    src: item.full || item.img,
                    title: item.title,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenMedia({
                      type: 'image',
                      src: item.full || item.img,
                      title: item.title,
                    });
                  }
                }}
              >
                <img
                  className="card__img"
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '0.2';
                  }}
                />
                <figcaption className="card__overlay">
                  <div className="card__title">{item.title}</div>
                  <div className="card__tags">{item.tags}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
