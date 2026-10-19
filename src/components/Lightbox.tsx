import React, { useEffect } from 'react';
import { LightboxMedia } from '../types';

interface LightboxProps {
  media: LightboxMedia | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ media, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (media) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div
      className="lightbox is-open"
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={media.title || 'Artwork viewer'}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        className="lightbox__close"
        aria-label="Close"
        type="button"
        onClick={onClose}
      >
        &#x2715;
      </button>

      {media.type === 'image' ? (
        <img
          className="lightbox__img"
          src={media.src}
          alt={media.title || 'Portfolio artwork'}
        />
      ) : (
        <video
          src={media.src}
          controls
          autoPlay
          loop
          playsInline
          style={{
            maxWidth: '92vw',
            maxHeight: '88vh',
            border: '5px solid #fff',
            backgroundColor: '#000',
            boxShadow: '12px 12px 0 var(--red)',
          }}
        />
      )}
    </div>
  );
};
