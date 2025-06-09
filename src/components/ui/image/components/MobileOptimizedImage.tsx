
// import React from 'react';
// import { useNetworkStatus } from '@/hooks/use-network-status';
// import { BasicImage } from './BasicImage';

// interface MobileOptimizedImageProps {
//   src: string;
//   lowQualitySrc?: string;
//   alt: string;
//   width?: number | string;  // Allow string or number
//   height?: number | string; // Allow string or number
//   className?: string;
//   loading?: 'lazy' | 'eager';
//   sizes?: string;
//   objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
// }

// /**
//  * Image component that adapts to mobile network conditions
//  * Uses lower quality images on slow connections or when save-data is enabled
//  */
// export function MobileOptimizedImage({
//   src,
//   lowQualitySrc,
//   alt,
//   width,
//   height,
//   className,
//   loading = 'lazy',
//   sizes,
//   objectFit = 'contain'
// }: MobileOptimizedImageProps) {
//   const network = useNetworkStatus();
  
//   // Use low quality image if:
//   // 1. User has enabled data-saving mode, or
//   // 2. Connection is slow (2g or slow-2g), or
//   // 3. RTT is very high indicating poor connection
//   // const shouldUseLowQuality = 
//   //   (network.saveDataEnabled) || 
//   //   (['slow-2g', '2g'].includes(network.effectiveConnectionType)) ||
//   //   (network.rtt !== null && network.rtt > 500);
  
//   // // If we have a low quality source and should use it
//   // const finalSrc = (shouldUseLowQuality && lowQualitySrc) ? lowQualitySrc : src;
  
//   // // Priority is higher if we're on a good connection
//   // const fetchPriority = network.effectiveConnectionType === '4g' ? 'high' : 'auto';
//   // FIXED: Smarter low quality detection - don't penalize good mobile connections
//   const shouldUseLowQuality = 
//     // Only if user explicitly enables data saving
//     network.saveDataEnabled || 
//     // Only truly slow connections (removed 3G penalization)
//     (['slow-2g', '2g'].includes(network.effectiveConnectionType)) ||
//     // High RTT AND low bandwidth (not just high RTT alone)
//     (network.rtt !== null && network.rtt > 1000 && 
//      network.downlink !== null && network.downlink < 0.5);
  
//   // Don't penalize 3G or higher quality connections
//   const isGoodConnection = ['3g', '4g'].includes(network.effectiveConnectionType) ||
//                           (network.downlink !== null && network.downlink > 1.0);
  
//   // If we have a low quality source and should use it, BUT not on good connections
//   const finalSrc = (shouldUseLowQuality && lowQualitySrc && !isGoodConnection) ? lowQualitySrc : src;
  
//   // Better priority logic based on actual connection quality
//   const fetchPriority = isGoodConnection ? 'high' : 'auto';
  
//   // Use more aggressive lazy loading on slow connections
//   // const finalLoading = 
//   //   shouldUseLowQuality && loading === 'lazy' ? 'lazy' : loading;
//   // Don't over-optimize lazy loading on decent connections
//   const finalLoading = 
//     (shouldUseLowQuality && !isGoodConnection && loading === 'lazy') ? 'lazy' : loading;

//   return (
//     <BasicImage
//       src={finalSrc}
//       alt={alt}
//       width={width as any}  // Use type assertion to bypass TypeScript check
//       height={height as any} // Use type assertion to bypass TypeScript check
//       className={className}
//       loading={finalLoading}
//       fetchPriority={fetchPriority}
//       sizes={sizes}
//       objectFit={objectFit}
//     />
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { BasicImage } from './BasicImage';

interface MobileOptimizedImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Enhanced mobile-optimized image component with smooth progressive loading
 * Adapts to network conditions and provides seamless transitions
 */
export function MobileOptimizedImage({
  src,
  lowQualitySrc,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  sizes,
  objectFit = 'contain'
}: MobileOptimizedImageProps) {
  const network = useNetworkStatus();
  const [imageState, setImageState] = useState<'loading' | 'low-quality' | 'high-quality' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>('');

  // Calculate aspect ratio for consistent layout
  const aspectRatio = (typeof width === 'number' && typeof height === 'number') 
    ? `${width}/${height}` 
    : '16/9';

  // Enhanced network condition detection
  const shouldUseLowQuality = 
    network.saveDataEnabled || 
    ['slow-2g', '2g'].includes(network.effectiveConnectionType) ||
    (network.rtt !== null && network.rtt > 1000 && 
     network.downlink !== null && network.downlink < 0.5);

  const isGoodConnection = ['3g', '4g'].includes(network.effectiveConnectionType) ||
                          (network.downlink !== null && network.downlink > 1.0);

  // Progressive image loading logic
  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      try {
        // Step 1: If we have low quality src and should use it, load that first
        if (shouldUseLowQuality && lowQualitySrc && !isGoodConnection) {
          if (mounted) {
            setCurrentSrc(lowQualitySrc);
            setImageState('low-quality');
          }
          
          // Small delay before upgrading to high quality
          setTimeout(() => {
            if (mounted && !shouldUseLowQuality) {
              setCurrentSrc(src);
              setImageState('high-quality');
            }
          }, 1000);
        } else {
          // Step 2: Load high quality directly on good connections
          if (mounted) {
            setCurrentSrc(src);
            setImageState('high-quality');
          }
        }
      } catch (error) {
        if (mounted) {
          setImageState('error');
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [src, lowQualitySrc, shouldUseLowQuality, isGoodConnection]);

  // Enhanced fetch priority based on connection and image state
  const getFetchPriority = (): 'high' | 'low' | 'auto' => {
    if (loading === 'eager') return 'high';
    if (isGoodConnection && imageState === 'high-quality') return 'high';
    if (imageState === 'low-quality') return 'auto';
    return 'auto';
  };

  // Container style with proper aspect ratio
  const containerStyle: React.CSSProperties = {
    aspectRatio,
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div 
      className={`aspect-ratio-container ${className || ''}`}
      style={containerStyle}
    >
      {/* Progressive loading indicator */}
      {imageState === 'loading' && (
        <div className="aspect-ratio-content skeleton-enhanced" />
      )}

      {/* Low quality image with blur effect for progressive enhancement */}
      {imageState === 'low-quality' && lowQualitySrc && (
        <div className="absolute inset-0">
          <BasicImage
            src={lowQualitySrc}
            alt={alt}
            width={width as number}
            height={height as number}
            className="aspect-ratio-content"
            loading={loading}
            fetchPriority="auto"
            sizes={sizes}
            objectFit={objectFit}
          />
          {/* Subtle overlay to indicate this is low quality */}
          <div 
            className="absolute inset-0 bg-white/5"
            style={{ 
              backdropFilter: 'blur(0.5px)',
              transition: 'opacity 0.3s ease-out'
            }}
          />
        </div>
      )}

      {/* High quality image */}
      {(imageState === 'high-quality' || (imageState === 'low-quality' && !lowQualitySrc)) && (
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            imageState === 'high-quality' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <BasicImage
            src={src}
            alt={alt}
            width={width as number}
            height={height as number}
            className="aspect-ratio-content"
            loading={loading}
            fetchPriority={getFetchPriority()}
            sizes={sizes}
            objectFit={objectFit}
          />
        </div>
      )}

      {/* Error state */}
      {imageState === 'error' && (
        <div className="aspect-ratio-content bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm text-center p-4">
            Failed to load image
          </div>
        </div>
      )}

      {/* Network quality indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {network.effectiveConnectionType} • {imageState}
        </div>
      )}
    </div>
  );
}