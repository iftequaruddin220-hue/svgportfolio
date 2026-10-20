import React from 'react';
import { LightboxMedia } from '../types';

interface DioFeatureProps {
  onOpenMedia: (media: LightboxMedia) => void;
}

export const DioFeature: React.FC<DioFeatureProps> = ({ onOpenMedia }) => {
  const turnaroundImg = "/assets/work/roblox-dio.png";
  const title = "DIO — Character turnaround";

  return (
    <article className="dio-feature" id="dio-feature">
      <div className="dio-feature__head">
        <div>
          <p className="hero__eyebrow">FEATURED / CHARACTER ART</p>
          <h3>DIO <span>— Beyond the ordinary.</span></h3>
        </div>
        <span className="dio-feature__index">01 / CHARACTER STUDY</span>
      </div>
      <figure
        className="card dio-feature__art"
        tabIndex={0}
        role="button"
        aria-label="Enlarge DIO character turnaround"
        onClick={() => onOpenMedia({ type: 'image', src: turnaroundImg, title })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenMedia({ type: 'image', src: turnaroundImg, title });
          }
        }}
      >
        <img
          src={turnaroundImg}
          alt="DIO character turnaround showing front and side views"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/work/dio-turnaround.png';
          }}
        />
      </figure>
      <div className="dio-feature__foot">
        <span>STYLIZED 3D · CHARACTER TURNAROUND</span>
        <span 
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenMedia({ type: 'image', src: turnaroundImg, title })}
        >
          VIEW FULL ARTWORK &#8599;
        </span>
      </div>
    </article>
  );
};
