import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = '1/1',
  priority = false // Add priority prop
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Initialize as true for priority images
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const timeoutRef = useRef(null);

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
    // Skip intersection observer for priority images
    if (priority) {
      setIsInView(true);
      return;
    }

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
      if (!priority && imgRef.current) {
        observer.disconnect();
      }
      // Clear timeout if component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [priority]);

  const handleImageLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    // Set a timeout to show placeholder after 5 seconds of trying to load
    timeoutRef.current = setTimeout(() => {
      setHasError(true);
      setIsLoaded(true); // Stop showing loading spinner
    }, 5000);
  };

  const imageUrls = getOptimizedImageUrl(src, 280); // 280px is our card width

  // Preload priority images
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
    }
  }, [src, priority]);

  return (
    <div 
      ref={!priority ? imgRef : null}
      className={`lazy-image-wrapper ${isLoaded ? 'loaded' : ''}`}
      style={{ 
        aspectRatio,
        backgroundColor: priority ? '#f0f0f0' : 'transparent' // Immediate background for priority images
      }}
    >
      {(isInView || priority) && (
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
            ref={imgRef}
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
              height: '100%'
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
          <span className="placeholder-text">Image not available</span>
        </div>
      )}
      {!isLoaded && priority && (
        <div className="priority-image-placeholder" />
      )}
    </div>
  );
};

export default LazyImage; 