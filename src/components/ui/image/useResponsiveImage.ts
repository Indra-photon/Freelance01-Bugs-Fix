import { useState, useEffect } from 'react';
import {
  getImageUrlByKey,
  getImageUrlByKeyAndSize,
  getImagePlaceholdersByKey,
  clearImageUrlCacheForKey,
  getGlobalCacheVersion
} from '@/services/images';
import { clearViewportSpecificCache } from '@/services/images/services/cacheService';
import { toast } from 'sonner';
import { ImageLoadingState } from './types';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useIsMobile } from '@/hooks/use-mobile';

// Mobile-specific keys
// const mobilePreferredKeys = new Set([
//   'hero-background',
//   'pricing-hero',
//   'process-hero',
//   'experience-hero',
// ]);
// Dynamic mobile key detection - checks if a mobile variant exists
const hasMobileVariant = (key: string): boolean => {
  // Common patterns for mobile variants
  const mobilePatterns = [
    'hero-background', 'pricing-hero', 'process-hero', 'experience-hero',
    'villalab-', 'tribe-', 'depth-', 'experience-'
  ];
  
  return mobilePatterns.some(pattern => key.startsWith(pattern) || key.includes(pattern));
};

export const useResponsiveImage = (
  dynamicKey?: string,
  size?: 'small' | 'medium' | 'large',
  debugCache?: boolean
): ImageLoadingState => {
  const [state, setState] = useState<ImageLoadingState>({
    isLoading: !!dynamicKey,
    error: false,
    dynamicSrc: null,
    aspectRatio: undefined,
    tinyPlaceholder: null,
    colorPlaceholder: null,
    contentHash: null,
    isCached: false,
    lastUpdated: null
  });

  const network = useNetworkStatus();
  const isMobile = useIsMobile();

  // Handle viewport changes and clear cache when mobile state changes
  // useEffect(() => {
  //   if (isMobile !== undefined && dynamicKey) {
  //     // Clear cache for this specific key when viewport changes
  //     clearImageUrlCacheForKey(dynamicKey);
      
  //     // Also clear any cached session storage for this image
  //     const globalVersion = getGlobalCacheVersion();
  //     globalVersion.then(version => {
  //       const cacheKey = `perfcache:${dynamicKey}:${size || 'original'}:${version || ''}`;
  //       const mobileKey = `${dynamicKey}-mobile`;
  //       const mobileCacheKey = `perfcache:${mobileKey}:${size || 'original'}:${version || ''}`;
        
  //       try {
  //         sessionStorage.removeItem(cacheKey);
  //         sessionStorage.removeItem(mobileCacheKey);
  //       } catch (e) {
  //         console.warn('Could not clear session storage cache:', e);
  //       }
  //     });
  //   }
  // }, [isMobile]); // Only run when isMobile changes
  // Handle viewport changes - only clear cache on actual changes, not initial load
  useEffect(() => {
    // Only process if we have a dynamicKey and mobile state is defined
    if (isMobile !== undefined && dynamicKey) {
      const storageKey = `mobile_state_${dynamicKey}`;
      const previousMobileState = sessionStorage.getItem(storageKey);
      
      console.log(`📱 [Viewport Change] isMobile: ${isMobile} for ${dynamicKey}, previous: ${previousMobileState}`);
      
      // Only clear cache if this is a REAL viewport change
      if (previousMobileState !== null && previousMobileState !== String(isMobile)) {
        console.log(`🧹 [Cache Clear] Viewport actually changed from ${previousMobileState} to ${isMobile}, clearing cache for ${dynamicKey}`);
        clearImageUrlCacheForKey(dynamicKey);
      } else if (previousMobileState === null) {
        console.log(`📝 [Initial Load] First time loading ${dynamicKey}, no cache clear needed`);
      } else {
        console.log(`⚡ [No Change] Mobile state unchanged for ${dynamicKey}, keeping cache`);
      }
      
      // Store current state for future comparisons
      sessionStorage.setItem(storageKey, String(isMobile));
    }
  }, [isMobile, dynamicKey]); // Include dynamicKey but only clear on real changes

  useEffect(() => {
    if (!dynamicKey) return;

    // const shouldUseMobile = isMobile && mobilePreferredKeys.has(dynamicKey);
    // const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;
    const shouldUseMobile = isMobile && hasMobileVariant(dynamicKey);
    const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;

    // setState(prev => ({ ...prev, isLoading: true, error: false }));
    // Don't start loading until mobile detection is complete (isMobile is not undefined)
    if (isMobile === undefined) {
      // Set initial loading state but don't fetch yet
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: false,
        dynamicSrc: null 
      }));
      return; // Wait for mobile detection to complete
    }
    // ADD THESE DEBUG LOGS HERE:
    console.log(`🔍 [useResponsiveImage] Debug Info:`, {
      dynamicKey,
      isMobile,
      hasMobileVariant: hasMobileVariant(dynamicKey),
      shouldUseMobile,
      effectiveKey,
      timestamp: new Date().toISOString()
    });

    setState(prev => ({ ...prev, isLoading: true, error: false }));

    // if (process.env.NODE_ENV === 'development') {
    //   clearImageUrlCacheForKey(effectiveKey);
    // }
    if (process.env.NODE_ENV === 'development' && debugCache) {
      console.log(`🔧 [Dev Mode] Debug cache enabled, clearing cache for ${effectiveKey}`);
      clearImageUrlCacheForKey(effectiveKey);
    }

    // const fetchImage = async () => {
    //   try {
    //     const globalVersion = await getGlobalCacheVersion();
    //     const cacheKey = `perfcache:${effectiveKey}:${size || 'original'}:${globalVersion || ''}`;
    //     const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;

    //     let cachedImageInfo: any = null;
    //     const cacheExpiryTime = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType)
    //       ? 15 * 60 * 1000
    //       : 5 * 60 * 1000;

    //     if (cachedData) {
    //       try {
    //         const parsed = JSON.parse(cachedData);
    //         const cacheAge = Date.now() - parsed.timestamp;
    //         if (cacheAge < cacheExpiryTime) {
    //           cachedImageInfo = parsed;
    //           if (debugCache) console.log(`Using cached image data for ${effectiveKey}`);
    //         }
    //       } catch (e) {
    //         console.error('Error parsing cached image data:', e);
    //       }
    //     }

    //     let tinyPlaceholder = null;
    //     let colorPlaceholder = null;

    //     if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
    //       const placeholders = await getImagePlaceholdersByKey(effectiveKey);
    //       tinyPlaceholder = placeholders.tinyPlaceholder;
    //       colorPlaceholder = placeholders.colorPlaceholder;

    //       if (tinyPlaceholder) {
    //         setState(prev => ({
    //           ...prev,
    //           tinyPlaceholder,
    //           colorPlaceholder,
    //         }));
    //       }
    //     }

    //     if (cachedImageInfo) {
    //       setState(prev => ({
    //         ...prev,
    //         dynamicSrc: cachedImageInfo.url,
    //         isLoading: false,
    //         aspectRatio: cachedImageInfo.aspectRatio,
    //         tinyPlaceholder: cachedImageInfo.tinyPlaceholder || prev.tinyPlaceholder,
    //         colorPlaceholder: cachedImageInfo.colorPlaceholder || prev.colorPlaceholder,
    //         contentHash: cachedImageInfo.contentHash,
    //         isCached: true,
    //         lastUpdated: cachedImageInfo.lastUpdated
    //       }));
    //       return;
    //     }

    //     if (debugCache) console.log(`Fetching image with key: ${effectiveKey}, size: ${size || 'original'}`);

    //     const placeholdersPromise = !tinyPlaceholder ? getImagePlaceholdersByKey(effectiveKey) : Promise.resolve({ tinyPlaceholder, colorPlaceholder });

    //     let imageUrl: string;
    //     let extractedContentHash = null;

    //     if (size) {
    //       imageUrl = await getImageUrlByKeyAndSize(effectiveKey, size);
    //     } else {
    //       imageUrl = await getImageUrlByKey(effectiveKey);
    //     }

    //     try {
    //       const urlObj = new URL(imageUrl);
    //       extractedContentHash = urlObj.searchParams.get('v') || null;
    //     } catch (err) {}

    //     const { tinyPlaceholder: tp, colorPlaceholder: cp } = await placeholdersPromise;
    //     tinyPlaceholder = tinyPlaceholder || tp;
    //     colorPlaceholder = colorPlaceholder || cp;

    //     const aspectRatio = await getImageAspectRatio(imageUrl);

    //     const imageInfo = {
    //       url: imageUrl,
    //       aspectRatio,
    //       tinyPlaceholder,
    //       colorPlaceholder,
    //       contentHash: extractedContentHash,
    //       timestamp: Date.now(),
    //       lastUpdated: new Date().toISOString(),
    //       globalVersion,
    //       networkType: network.effectiveConnectionType
    //     };

    //     try {
    //       if (navigator.onLine) {
    //         sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
    //       }
    //     } catch (e) {
    //       console.warn('Failed to cache image data in sessionStorage:', e);
    //     }

    //     setState(prev => ({
    //       ...prev,
    //       dynamicSrc: imageUrl,
    //       isLoading: false,
    //       aspectRatio,
    //       tinyPlaceholder,
    //       colorPlaceholder,
    //       contentHash: extractedContentHash,
    //       isCached: false,
    //       lastUpdated: imageInfo.lastUpdated
    //     }));
    //   } catch (error) {
    //     console.error(`Failed to load image with key ${dynamicKey}:`, error);
    //     setState(prev => ({ ...prev, error: true, isLoading: false }));

    //     if (!['hero-', 'pricing-', 'process-', 'experience-'].some(k => dynamicKey?.includes(k))) {
    //       toast.error(`Failed to load image: ${dynamicKey}`, {
    //         description: "Please check if this image exists in your storage.",
    //         duration: 3000,
    //       });
    //     }
    //   }
    // };
      const fetchImage = async () => {
      // ADD PERFORMANCE TIMING:
      const startTime = performance.now();
      console.log(`⏱️ [Performance] Starting fetch for ${effectiveKey} at ${startTime}ms`);

      // ADD THIS DEBUG LOG:
      console.log(`🚀 [fetchImage] Starting fetch for:`, {
        originalKey: dynamicKey,
        effectiveKey,
        isMobile,
        size: size || 'original',
        timestamp: new Date().toISOString()
      });

      try {
        const globalVersion = await getGlobalCacheVersion();
        const cacheKey = `perfcache:${effectiveKey}:${size || 'original'}:${globalVersion || ''}`;
        
        // TIMING: Cache check
        const cacheCheckTime = performance.now();
        console.log(`⏱️ [Performance] Cache check completed at ${cacheCheckTime - startTime}ms`);
        
        const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;

        let cachedImageInfo: any = null;
        const cacheExpiryTime = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType)
          ? 15 * 60 * 1000
          : 5 * 60 * 1000;

        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsed.timestamp;
            if (cacheAge < cacheExpiryTime) {
              cachedImageInfo = parsed;
              if (debugCache) console.log(`Using cached image data for ${effectiveKey}`);
            }
          } catch (e) {
            console.error('Error parsing cached image data:', e);
          }
        }

        let tinyPlaceholder = null;
        let colorPlaceholder = null;

        if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
          const placeholders = await getImagePlaceholdersByKey(effectiveKey);
          tinyPlaceholder = placeholders.tinyPlaceholder;
          colorPlaceholder = placeholders.colorPlaceholder;

          if (tinyPlaceholder) {
            setState(prev => ({
              ...prev,
              tinyPlaceholder,
              colorPlaceholder,
            }));
          }
        }

        if (cachedImageInfo) {
          const cacheHitTime = performance.now();
          console.log(`⏱️ [Performance] Cache HIT! Total time: ${cacheHitTime - startTime}ms`);
          
          setState(prev => ({
            ...prev,
            dynamicSrc: cachedImageInfo.url,
            isLoading: false,
            aspectRatio: cachedImageInfo.aspectRatio,
            tinyPlaceholder: cachedImageInfo.tinyPlaceholder || prev.tinyPlaceholder,
            colorPlaceholder: cachedImageInfo.colorPlaceholder || prev.colorPlaceholder,
            contentHash: cachedImageInfo.contentHash,
            isCached: true,
            lastUpdated: cachedImageInfo.lastUpdated
          }));
          return;
        }

        // TIMING: Network request start
        const networkStartTime = performance.now();
        console.log(`⏱️ [Performance] Starting network request at ${networkStartTime - startTime}ms`);

        if (debugCache) console.log(`Fetching image with key: ${effectiveKey}, size: ${size || 'original'}`);

        const placeholdersPromise = !tinyPlaceholder ? getImagePlaceholdersByKey(effectiveKey) : Promise.resolve({ tinyPlaceholder, colorPlaceholder });

        let imageUrl: string;
        let extractedContentHash = null;

        if (size) {
          imageUrl = await getImageUrlByKeyAndSize(effectiveKey, size);
        } else {
          imageUrl = await getImageUrlByKey(effectiveKey);
        }

        // TIMING: URL fetched
        const urlFetchTime = performance.now();
        console.log(`⏱️ [Performance] URL fetched at ${urlFetchTime - startTime}ms: ${imageUrl}`);

        try {
          const urlObj = new URL(imageUrl);
          extractedContentHash = urlObj.searchParams.get('v') || null;
        } catch (err) {}

        const { tinyPlaceholder: tp, colorPlaceholder: cp } = await placeholdersPromise;
        tinyPlaceholder = tinyPlaceholder || tp;
        colorPlaceholder = colorPlaceholder || cp;

        const aspectRatio = await getImageAspectRatio(imageUrl);

        const imageInfo = {
          url: imageUrl,
          aspectRatio,
          tinyPlaceholder,
          colorPlaceholder,
          contentHash: extractedContentHash,
          timestamp: Date.now(),
          lastUpdated: new Date().toISOString(),
          globalVersion,
          networkType: network.effectiveConnectionType
        };

        try {
          if (navigator.onLine) {
            sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
          }
        } catch (e) {
          console.warn('Failed to cache image data in sessionStorage:', e);
        }

        // ADD THIS DEBUG LOG BEFORE THE FINAL setState:
        console.log(`✅ [fetchImage] About to set final state:`, {
          originalKey: dynamicKey,
          effectiveKey,
          imageUrl,
          isMobile,
          timestamp: new Date().toISOString()
        });

        // TIMING: Complete
        const completeTime = performance.now();
        console.log(`⏱️ [Performance] COMPLETE! Total time: ${completeTime - startTime}ms for ${effectiveKey}`);

        setState(prev => ({
          ...prev,
          dynamicSrc: imageUrl,
          isLoading: false,
          aspectRatio,
          tinyPlaceholder,
          colorPlaceholder,
          contentHash: extractedContentHash,
          isCached: false,
          lastUpdated: imageInfo.lastUpdated
        }));
      } catch (error) {
        const errorTime = performance.now();
        console.log(`⏱️ [Performance] ERROR at ${errorTime - startTime}ms:`, error);
        
        console.error(`Failed to load image with key ${dynamicKey}:`, error);
        setState(prev => ({ ...prev, error: true, isLoading: false }));

        if (!['hero-', 'pricing-', 'process-', 'experience-'].some(k => dynamicKey?.includes(k))) {
          toast.error(`Failed to load image: ${dynamicKey}`, {
            description: "Please check if this image exists in your storage.",
            duration: 3000,
          });
        }
      }
    };
    // const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)
    //   ? 300 : 0;
    // ADD PRIORITY LOGIC FOR HERO IMAGE:
    const isHeroImage = dynamicKey?.includes('hero-background');
    const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)
      ? (isHeroImage ? 0 : 300)  // No delay for hero images
      : (isHeroImage ? 0 : 100); // Small delay for non-hero to prioritize hero

    console.log(`🚀 [Priority] ${effectiveKey} is hero: ${isHeroImage}, delay: ${delay}ms`);

    const timeoutId = setTimeout(fetchImage, delay);
    return () => clearTimeout(timeoutId);
  }, [dynamicKey, size, debugCache, network.online, network.effectiveConnectionType, isMobile]);

  return state;
};

const getImageAspectRatio = (url: string): Promise<number | undefined> => {
  return new Promise(resolve => {
    if (url === '/placeholder.svg') {
      resolve(16 / 9);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(img.width / img.height);
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
};
