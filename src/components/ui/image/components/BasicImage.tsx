// import React from 'react';
// import { createImageProps } from '../utils';

// interface BasicImageProps {
//   src: string;
//   alt: string;
//   className?: string;
//   loading?: 'lazy' | 'eager';
//   fetchPriority?: 'high' | 'low' | 'auto';
//   onClick?: () => void;
//   fallbackSrc?: string;
//   width?: number;
//   height?: number;
//   sizes?: string;
//   objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
// }

// /**
//  * Basic image component for simple URL sources
//  */
// export const BasicImage = ({
//   src,
//   alt,
//   className,
//   loading = 'lazy',
//   fetchPriority,
//   onClick,
//   fallbackSrc = '/placeholder.svg',
//   width,
//   height,
//   sizes,
//   objectFit = 'contain'
// }: BasicImageProps) => {
//   const imgProps = createImageProps(
//     src, 
//     alt, 
//     className, 
//     loading, 
//     sizes,
//     width, 
//     height, 
//     fallbackSrc, 
//     fetchPriority
//   );
  
//   // Apply object-fit directly to the style object for the img element
//   const style = { 
//     ...imgProps.style, 
//     objectFit 
//   };
  
//   // Use fetchPriority as a regular prop, not fetchpriority (lowercase)
//   return <img {...imgProps} style={style} onClick={onClick} fetchPriority={fetchPriority} />;
// };

import React, { useState, useEffect } from 'react';
import { createImageProps } from '../utils';

interface BasicImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Basic image component with smooth loading transitions and aspect ratio preservation
 */
export const BasicImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  fetchPriority,
  onClick,
  fallbackSrc = '/placeholder.svg',
  width,
  height,
  sizes,
  objectFit = 'contain'
}: BasicImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset loading state when src changes
  useEffect(() => {
    if (currentSrc !== src) {
      setIsLoaded(false);
      setHasError(false);
      setCurrentSrc(src);
    }
  }, [src, currentSrc]);

  // Calculate aspect ratio for layout preservation
  const aspectRatio = width && height ? `${width}/${height}` : '16/9';
  
  const imgProps = createImageProps(
    currentSrc, 
    alt, 
    '', // Don't pass className here, we'll handle it
    loading, 
    sizes,
    width, 
    height, 
    fallbackSrc, 
    fetchPriority
  );
  
  // Enhanced style with smooth transitions and aspect ratio
  const containerStyle: React.CSSProperties = {
    aspectRatio,
    width: width || '100%',
    height: height || 'auto',
    position: 'relative',
    overflow: 'hidden'
  };

  const imageStyle: React.CSSProperties = {
    ...imgProps.style,
    objectFit,
    width: '100%',
    height: '100%',
    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isLoaded ? 1 : 0
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoaded(false);
    }
  };

  return (
    <div 
      className={`aspect-ratio-container ${className || ''}`}
      style={containerStyle}
      onClick={onClick}
    >
      {/* Loading skeleton - shows while image loads */}
      {!isLoaded && !hasError && (
        <div 
          className="skeleton-enhanced absolute inset-0 rounded"
          style={{ aspectRatio }}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded"
          style={{ aspectRatio }}
        >
          <div className="text-gray-400 text-sm text-center p-4">
            Image not available
          </div>
        </div>
      )}
      
      {/* Main image */}
      <img
        {...imgProps}
        src={currentSrc}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        fetchPriority={fetchPriority}
        className="aspect-ratio-content"
      />
    </div>
  );
};