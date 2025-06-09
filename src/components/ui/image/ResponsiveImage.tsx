
// import React, { useState, useEffect } from 'react';
// import { useResponsiveImage } from './useResponsiveImage';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { LoadingPlaceholder } from './components/LoadingPlaceholder';
// import { ErrorPlaceholder } from './components/ErrorPlaceholder';
// import { ResponsiveImageProps, ResponsiveImageSource } from './types';
// import { ResponsivePicture } from './components/ResponsivePicture';
// import { BasicImage } from './components/BasicImage';
// import { CacheDebugInfo } from './components/CacheDebugInfo';
// import { MobileOptimizedImage } from './components/MobileOptimizedImage';
// import { useNetworkStatus } from '@/hooks/use-network-status';

// /**
//  * A component that renders responsive images with different sources for mobile, tablet, and desktop
//  * Enhanced with content-based cache keys, debugging capabilities, and mobile optimization
//  */
// const ResponsiveImage = ({
//   src,
//   alt,
//   className = '',
//   loading = 'lazy',
//   priority,
//   fetchPriority,
//   onClick,
//   dynamicKey,
//   size,
//   fallbackSrc = '/placeholder.svg',
//   width,
//   height,
//   sizes,
//   objectFit = 'cover',
//   debugCache = false
// }: ResponsiveImageProps) => {
//   const [useMobileSrc, setUseMobileSrc] = useState<boolean>(false);
//   const isMobile = useIsMobile();
//   const network = useNetworkStatus();
  
//   // Determine if we should use lower quality images based on network conditions
//   const useLowQualityOnPoorConnection = 
//     network.saveDataEnabled || 
//     ['slow-2g', '2g'].includes(network.effectiveConnectionType) ||
//     (network.rtt !== null && network.rtt > 500);

//   // Set mobile source flag based on device detection
//   useEffect(() => {
//     setUseMobileSrc(!!isMobile);
//   }, [isMobile]);

//   // Handle priority for browser loading hint
//   // Adjust based on network conditions
//   const finalFetchPriority = priority 
//     ? 'high' 
//     : (fetchPriority || (loading === 'eager' 
//         ? (useLowQualityOnPoorConnection ? 'auto' : 'high') 
//         : 'auto'));

//   // Use the hook to load dynamic images from storage
//   const { 
//     isLoading, 
//     error, 
//     dynamicSrc, 
//     aspectRatio,
//     tinyPlaceholder,
//     colorPlaceholder,
//     contentHash,
//     isCached,
//     lastUpdated
//   } = useResponsiveImage(dynamicKey, 
//     // Use a smaller size on poor connections
//     useLowQualityOnPoorConnection && size === 'large' ? 'medium' : size, 
//     debugCache);
  
//   // For debugging
//   useEffect(() => {
//     if (dynamicKey && dynamicSrc) {
//       console.log(`[ResponsiveImage] Rendered ${dynamicKey} with URL: ${dynamicSrc}`);
//       if (useLowQualityOnPoorConnection) {
//         console.log(`[ResponsiveImage] Using lower quality for ${dynamicKey} due to network conditions`);
//       }
//     }
//   }, [dynamicKey, dynamicSrc, useLowQualityOnPoorConnection]);

//   // If we're loading a dynamic image and it's still loading
//   if (dynamicKey && isLoading) {
//     return (
//       <LoadingPlaceholder
//         alt={alt}
//         className={className}
//         width={width}
//         height={height}
//         aspectRatio={aspectRatio}
//         placeholderSrc={tinyPlaceholder || undefined}
//         colorPlaceholder={colorPlaceholder || undefined}
//       />
//     );
//   }

//   // If there was an error loading the dynamic image
//   if (dynamicKey && error) {
//     return (
//       <ErrorPlaceholder 
//         alt={alt} 
//         className={className}
//         width={width}
//         height={height}
//         aspectRatio={aspectRatio || 16/9}
//         fallbackSrc={fallbackSrc}
//       />
//     );
//   }

//   // If we have a dynamic source, use it with mobile optimization
//   if (dynamicKey && dynamicSrc) {
//     return (
//       <div className={`relative ${className}`} style={{ width, height }}>
//         <MobileOptimizedImage
//           src={dynamicSrc}
//           lowQualitySrc={tinyPlaceholder || undefined}
//           alt={alt}
//           loading={loading}
//           className="w-full h-full"
//           width={width}
//           height={height}
//           sizes={sizes}
//           objectFit={objectFit}
//         />
//         {onClick && (
//           <div 
//             className="absolute inset-0 cursor-pointer" 
//             onClick={onClick}
//             aria-label={`Click to interact with ${alt}`}
//           />
//         )}
//         {debugCache && (
//           <CacheDebugInfo
//             dynamicKey={dynamicKey}
//             url={dynamicSrc}
//             isLoading={isLoading}
//             isCached={isCached}
//             contentHash={contentHash}
//             lastUpdated={lastUpdated}
//           />
//         )}
//       </div>
//     );
//   }

//   // For responsive image object with mobile, tablet, desktop variants
//   if (typeof src === 'object' && 'mobile' in src && 'desktop' in src) {
//     return (
//       <div className="relative" style={{ width, height }}>
//         <ResponsivePicture
//           sources={{
//             mobile: src.mobile,
//             tablet: src.tablet,
//             desktop: src.desktop
//           }}
//           alt={alt}
//           className={className}
//           loading={loading}
//           fetchPriority={finalFetchPriority}
//           onClick={onClick}
//           width={width}
//           height={height}
//           sizes={sizes}
//           fallbackSrc={fallbackSrc}
//           useMobileSrc={useMobileSrc}
//           objectFit={objectFit}
//         />
//         {debugCache && (
//           <CacheDebugInfo
//             url={useMobileSrc ? src.mobile : (src.desktop || src.mobile)}
//             isLoading={false}
//             isCached={false}
//           />
//         )}
//       </div>
//     );
//   }

//   // Default case: simple image
//   return (
//     <div className="relative" style={{ width, height }}>
//       <BasicImage
//         src={typeof src === 'string' ? src : fallbackSrc}
//         alt={alt}
//         loading={loading}
//         fetchPriority={finalFetchPriority}
//         onClick={onClick}
//         className={className || "w-full h-full"}
//         width={width}
//         height={height}
//         sizes={sizes}
//         fallbackSrc={fallbackSrc}
//         objectFit={objectFit}
//       />
//       {debugCache && (
//         <CacheDebugInfo
//           url={typeof src === 'string' ? src : fallbackSrc}
//           isLoading={false}
//           isCached={false}
//         />
//       )}
//     </div>
//   );
// };

// export default ResponsiveImage;

import React, { useState, useEffect } from 'react';
import { useResponsiveImage } from './useResponsiveImage';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import { ResponsiveImageProps, ResponsiveImageSource } from './types';
import { ResponsivePicture } from './components/ResponsivePicture';
import { BasicImage } from './components/BasicImage';
import { CacheDebugInfo } from './components/CacheDebugInfo';
import { MobileOptimizedImage } from './components/MobileOptimizedImage';
import { useNetworkStatus } from '@/hooks/use-network-status';

// Critical image keys that should be preloaded
const CRITICAL_IMAGE_KEYS = [
  'hero-background',
  'hero-background-mobile',
  'pricing-hero',
  'experience-hero',
  'process-hero'
];

/**
 * Enhanced responsive image component with critical image preloading and smooth transitions
 * Provides optimal loading experience across all devices and network conditions
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority,
  fetchPriority,
  onClick,
  dynamicKey,
  size,
  fallbackSrc = '/placeholder.svg',
  width,
  height,
  sizes,
  objectFit = 'cover',
  debugCache = false
}: ResponsiveImageProps) => {
  const [useMobileSrc, setUseMobileSrc] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const network = useNetworkStatus();
  
  // Determine if this is a critical image that should be preloaded
  const isCriticalImage = dynamicKey && CRITICAL_IMAGE_KEYS.some(key => 
    dynamicKey.includes(key) || key.includes(dynamicKey)
  );

  // Calculate aspect ratio for layout preservation
  const aspectRatio = width && height ? `${width}/${height}` : '16/9';
  
  // Enhanced network condition detection
  const useLowQualityOnPoorConnection = 
    network.saveDataEnabled || 
    ['slow-2g', '2g'].includes(network.effectiveConnectionType) ||
    (network.rtt !== null && network.rtt > 500);

  // Set mobile source flag based on device detection
  useEffect(() => {
    setUseMobileSrc(!!isMobile);
  }, [isMobile]);

  // Critical image preloading
  useEffect(() => {
    if (isCriticalImage && dynamicKey) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      
      // Preload the appropriate version based on device
      const preloadKey = isMobile && dynamicKey.includes('hero') 
        ? `${dynamicKey}-mobile` 
        : dynamicKey;
      
      // Use a reasonable size for preloading
      const preloadSize = isMobile ? 'medium' : 'large';
      
      console.log(`🚀 [Preload] Critical image: ${preloadKey} (${preloadSize})`);
      
      // Note: In a real implementation, you'd get the actual URL from your image service
      // link.href = getImageUrlByKeyAndSize(preloadKey, preloadSize);
      document.head.appendChild(link);
      
      return () => {
        try {
          document.head.removeChild(link);
        } catch (e) {
          // Link may have already been removed
        }
      };
    }
  }, [dynamicKey, isCriticalImage, isMobile]);

  // Intersection Observer for lazy loading optimization
  useEffect(() => {
    if (!isCriticalImage && loading === 'lazy') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image comes into view
          threshold: 0.1
        }
      );

      const element = document.querySelector(`[data-image-key="${dynamicKey}"]`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    } else {
      // Critical images should always be visible
      setIsVisible(true);
    }
  }, [dynamicKey, isCriticalImage, loading]);

  // Enhanced priority logic
  const finalFetchPriority = (() => {
    if (isCriticalImage) return 'high';
    if (priority) return 'high';
    if (fetchPriority) return fetchPriority;
    if (loading === 'eager') return useLowQualityOnPoorConnection ? 'auto' : 'high';
    return 'auto';
  })();

  // Enhanced loading logic - only load when visible or critical
  const shouldLoad = isCriticalImage || isVisible || loading === 'eager';

  // Use the hook to load dynamic images from storage
  const { 
    isLoading, 
    error, 
    dynamicSrc, 
    aspectRatio: hookAspectRatio,
    tinyPlaceholder,
    colorPlaceholder,
    contentHash,
    isCached,
    lastUpdated
  } = useResponsiveImage(
    shouldLoad ? dynamicKey : undefined,
    useLowQualityOnPoorConnection && size === 'large' ? 'medium' : size, 
    debugCache
  );
  
  // Use hook aspect ratio if available, fallback to calculated
  const finalAspectRatio = hookAspectRatio || (width && height ? width / height : 16/9);

  // Container style with proper aspect ratio preservation
  const containerStyle: React.CSSProperties = {
    aspectRatio: `${finalAspectRatio}`,
    width: width || '100%',
    height: height || 'auto',
    position: 'relative'
  };

  // For debugging
  useEffect(() => {
    if (dynamicKey && dynamicSrc) {
      console.log(`🖼️ [ResponsiveImage] Rendered ${dynamicKey} with URL: ${dynamicSrc}`);
      if (isCriticalImage) {
        console.log(`⚡ [Critical] ${dynamicKey} loaded as critical image`);
      }
      if (useLowQualityOnPoorConnection) {
        console.log(`🐌 [Network] Using optimized quality for ${dynamicKey} due to connection`);
      }
    }
  }, [dynamicKey, dynamicSrc, isCriticalImage, useLowQualityOnPoorConnection]);

  // If we're loading a dynamic image and it's still loading
  if (dynamicKey && (isLoading || !shouldLoad)) {
    return (
      <div 
        className={`aspect-ratio-container ${className}`}
        style={containerStyle}
        data-image-key={dynamicKey}
      >
        <LoadingPlaceholder
          alt={alt}
          className="aspect-ratio-content"
          width={width}
          height={height}
          aspectRatio={finalAspectRatio}
          placeholderSrc={tinyPlaceholder || undefined}
          colorPlaceholder={colorPlaceholder || undefined}
        />
      </div>
    );
  }

  // If there was an error loading the dynamic image
  if (dynamicKey && error) {
    return (
      <div 
        className={`aspect-ratio-container ${className}`}
        style={containerStyle}
        data-image-key={dynamicKey}
      >
        <ErrorPlaceholder 
          alt={alt} 
          className="aspect-ratio-content"
          width={width}
          height={height}
          aspectRatio={finalAspectRatio}
          fallbackSrc={fallbackSrc}
        />
      </div>
    );
  }

  // If we have a dynamic source, use it with mobile optimization
  if (dynamicKey && dynamicSrc) {
    return (
      <div 
        className={`aspect-ratio-container ${className}`} 
        style={containerStyle}
        data-image-key={dynamicKey}
      >
        <MobileOptimizedImage
          src={dynamicSrc}
          lowQualitySrc={tinyPlaceholder || undefined}
          alt={alt}
          loading={loading}
          className="aspect-ratio-content"
          width={width}
          height={height}
          sizes={sizes}
          objectFit={objectFit}
        />
        {onClick && (
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={onClick}
            aria-label={`Click to interact with ${alt}`}
          />
        )}
        {debugCache && (
          <CacheDebugInfo
            dynamicKey={dynamicKey}
            url={dynamicSrc}
            isLoading={isLoading}
            isCached={isCached}
            contentHash={contentHash}
            lastUpdated={lastUpdated}
          />
        )}
        {/* Critical image indicator (development only) */}
        {process.env.NODE_ENV === 'development' && isCriticalImage && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br">
            CRITICAL
          </div>
        )}
      </div>
    );
  }

  // For responsive image object with mobile, tablet, desktop variants
  if (typeof src === 'object' && 'mobile' in src && 'desktop' in src) {
    return (
      <div 
        className={`aspect-ratio-container ${className}`} 
        style={containerStyle}
      >
        <ResponsivePicture
          sources={{
            mobile: src.mobile,
            tablet: src.tablet,
            desktop: src.desktop
          }}
          alt={alt}
          className="aspect-ratio-content"
          loading={loading}
          fetchPriority={finalFetchPriority}
          onClick={onClick}
          width={width}
          height={height}
          sizes={sizes}
          fallbackSrc={fallbackSrc}
          useMobileSrc={useMobileSrc}
          objectFit={objectFit}
        />
        {debugCache && (
          <CacheDebugInfo
            url={useMobileSrc ? src.mobile : (src.desktop || src.mobile)}
            isLoading={false}
            isCached={false}
          />
        )}
      </div>
    );
  }

  // Default case: simple image with enhanced loading
  return (
    <div 
      className={`aspect-ratio-container ${className}`} 
      style={containerStyle}
    >
      <BasicImage
        src={typeof src === 'string' ? src : fallbackSrc}
        alt={alt}
        loading={loading}
        fetchPriority={finalFetchPriority}
        onClick={onClick}
        className="aspect-ratio-content"
        width={width}
        height={height}
        sizes={sizes}
        fallbackSrc={fallbackSrc}
        objectFit={objectFit}
      />
      {debugCache && (
        <CacheDebugInfo
          url={typeof src === 'string' ? src : fallbackSrc}
          isLoading={false}
          isCached={false}
        />
      )}
    </div>
  );
};

export default ResponsiveImage;