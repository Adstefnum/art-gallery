import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className = '', aspectRatio = '1/1' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Generate optimized image URLs
  const getOptimizedImageUrl = (originalUrl, width) => {
    // If the image is from your public assets
    if (originalUrl.startsWith('/assets')) {
      // Remove the /assets prefix for proper path resolution
      const imagePath = originalUrl.replace('/assets', '');
      
      // Generate WebP version if supported
      return {
        src: `${process.env.PUBLIC_URL}/assets${imagePath}`, // original path
        srcSet: `
          ${process.env.PUBLIC_URL}/assets/optimized${imagePath.replace(/\.(jpg|png|jpeg)$/, '.webp')} 1x,
          ${process.env.PUBLIC_URL}/assets/optimized${imagePath.replace(/\.(jpg|png|jpeg)$/, '@2x.webp')} 2x
        `,
        fallback: `
          ${process.env.PUBLIC_URL}/assets/optimized${imagePath} 1x,
          ${process.env.PUBLIC_URL}/assets/optimized${imagePath.replace(/\.(jpg|png|jpeg)$/, '@2x.$1')} 2x
        `
      };
    }
    
    // For external images, you might want to use an image CDN
    return {
      src: originalUrl,
      srcSet: originalUrl,
      fallback: originalUrl
    };
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
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

  const imageUrls = getOptimizedImageUrl(src, 280); // 280px is our card width

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-wrapper ${isLoaded ? 'loaded' : ''}`}
      style={{ aspectRatio }}
    >
      {isInView && (
        <picture>
          <source
            type="image/webp"
            srcSet={imageUrls.srcSet}
            sizes="(max-width: 768px) 100vw, 280px"
          />
          <source
            type="image/jpeg"
            srcSet={imageUrls.fallback}
            sizes="(max-width: 768px) 100vw, 280px"
          />
          <img
            src={imageUrls.src}
            alt={alt}
            className={`lazy-image ${className}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            width="280"
            height="280"
          />
        </picture>
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