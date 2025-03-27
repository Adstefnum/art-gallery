import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className = '', aspectRatio = '1/1' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading images 50px before they enter viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-wrapper ${isLoaded ? 'loaded' : ''}`}
      style={{ aspectRatio }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${className}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && (
        <div className="lazy-image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage; 