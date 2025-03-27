import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import './LazyImage.css';

const LazyImage = memo(({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = '1/1',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const timeoutRef = useRef(null);

  const getOptimizedImageUrl = (originalUrl, width) => {
    if (originalUrl.startsWith('/assets')) {
      const imagePath = originalUrl.replace('/assets', '');
      
      return {
        src: `${process.env.PUBLIC_URL}/assets${imagePath}`,
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
    
    return {
      src: originalUrl,
      srcSet: originalUrl,
      fallback: originalUrl
    };
  };

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current && !isInView) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [priority, isInView]);

  const handleImageLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHasError(true);
      setIsLoaded(true);
    }, 5000);
  };

  // Move image URL processing outside of render
  const imageUrls = useMemo(() => getOptimizedImageUrl(src, 280), [src]);

  return (
    <div 
      ref={!priority ? imgRef : null}
      className={`lazy-image-wrapper ${isLoaded ? 'loaded' : ''}`}
      style={{ 
        aspectRatio,
        backgroundColor: priority ? '#f0f0f0' : 'transparent'
      }}
    >
      {(isInView || priority) && (
        <picture>
          <source
            type="image/webp"
            srcSet={imageUrls.srcSet}
            sizes="280px"
          />
          <img
            src={imageUrls.src}
            alt={alt}
            className={`lazy-image ${className}`}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            width="280"
            height="280"
            style={{ 
              display: 'block',
              width: '100%',
              height: '100%',
              willChange: 'transform' // Add hardware acceleration hint
            }}
            fetchpriority={priority ? "high" : "auto"}
          />
        </picture>
      )}
      {!isLoaded && !hasError && (
        <div className="lazy-image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      {hasError && (
        <div className="image-error-placeholder">
          <span className="placeholder-text">Failed to load image</span>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Implement deep comparison for memoization
  return prevProps.src === nextProps.src && 
         prevProps.priority === nextProps.priority;
});

LazyImage.displayName = 'LazyImage';

export default LazyImage; 