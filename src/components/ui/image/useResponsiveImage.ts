// import { useState, useEffect } from 'react';
// import {
//   getImageUrlByKey,
//   getImageUrlByKeyAndSize,
//   getImagePlaceholdersByKey,
//   clearImageUrlCacheForKey,
//   getGlobalCacheVersion
// } from '@/services/images';
// import { clearViewportSpecificCache } from '@/services/images/services/cacheService';
// import { toast } from 'sonner';
// import { ImageLoadingState } from './types';
// import { useNetworkStatus } from '@/hooks/use-network-status';
// import { useIsMobile } from '@/hooks/use-mobile';
// // FIXED: Memory cache fallback for when sessionStorage fails on mobile devices
// const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// // Helper function to clean expired memory cache entries
// const cleanMemoryCache = () => {
//   const now = Date.now();
//   for (const [key, entry] of memoryCache.entries()) {
//     if (now > entry.timestamp + entry.ttl) {
//       memoryCache.delete(key);
//     }
//   }
// };

// // Clean memory cache every 5 minutes
// setInterval(cleanMemoryCache, 5 * 60 * 1000);

// // FIXED: Robust caching with fallbacks
// const cacheImageInfo = (cacheKey: string, imageInfo: any): void => {
//   try {
//     if (navigator.onLine) {
//       sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
//       console.log(`💾 [Cache] Stored in sessionStorage: ${cacheKey}`);
//     }
//   } catch (storageError) {
//     console.warn('📱 [Mobile Fix] SessionStorage failed, using memory cache fallback:', storageError);
    
//     // Fallback to in-memory cache with 10 minute TTL
//     memoryCache.set(cacheKey, {
//       data: imageInfo,
//       timestamp: Date.now(),
//       ttl: 10 * 60 * 1000 // 10 minutes
//     });
//     console.log(`🧠 [Memory Cache] Stored in memory: ${cacheKey}`);
//   }
// };

// const getCachedImageInfo = (cacheKey: string): any | null => {
//   try {
//     const cached = sessionStorage.getItem(cacheKey);
//     if (cached) {
//       console.log(`💾 [Cache Hit] SessionStorage: ${cacheKey}`);
//       return JSON.parse(cached);
//     }
//   } catch (e) {
//     console.warn('📱 [Mobile Fix] SessionStorage read failed, checking memory cache');
//   }
  
//   // Fallback to memory cache
//   const memoryEntry = memoryCache.get(cacheKey);
//   if (memoryEntry && Date.now() <= memoryEntry.timestamp + memoryEntry.ttl) {
//     console.log(`🧠 [Cache Hit] Memory cache: ${cacheKey}`);
//     return memoryEntry.data;
//   }
  
//   console.log(`❌ [Cache Miss] No cache found for: ${cacheKey}`);
//   return null;
// };

// // Mobile-specific keys
// // const mobilePreferredKeys = new Set([
// //   'hero-background',
// //   'pricing-hero',
// //   'process-hero',
// //   'experience-hero',
// // ]);
// // Dynamic mobile key detection - checks if a mobile variant exists
// const hasMobileVariant = (key: string): boolean => {
//   // Common patterns for mobile variants
//   const mobilePatterns = [
//     'hero-background', 'pricing-hero', 'process-hero', 'experience-hero',
//     'villalab-', 'tribe-', 'depth-', 'experience-'
//   ];
  
//   return mobilePatterns.some(pattern => key.startsWith(pattern) || key.includes(pattern));
// };

// export const useResponsiveImage = (
//   dynamicKey?: string,
//   size?: 'small' | 'medium' | 'large',
//   debugCache?: boolean
// ): ImageLoadingState => {
//   const [state, setState] = useState<ImageLoadingState>({
//     isLoading: !!dynamicKey,
//     error: false,
//     dynamicSrc: null,
//     aspectRatio: undefined,
//     tinyPlaceholder: null,
//     colorPlaceholder: null,
//     contentHash: null,
//     isCached: false,
//     lastUpdated: null
//   });

//   const network = useNetworkStatus();
//   const isMobile = useIsMobile();

//   // Handle viewport changes and clear cache when mobile state changes
//   // useEffect(() => {
//   //   if (isMobile !== undefined && dynamicKey) {
//   //     // Clear cache for this specific key when viewport changes
//   //     clearImageUrlCacheForKey(dynamicKey);
      
//   //     // Also clear any cached session storage for this image
//   //     const globalVersion = getGlobalCacheVersion();
//   //     globalVersion.then(version => {
//   //       const cacheKey = `perfcache:${dynamicKey}:${size || 'original'}:${version || ''}`;
//   //       const mobileKey = `${dynamicKey}-mobile`;
//   //       const mobileCacheKey = `perfcache:${mobileKey}:${size || 'original'}:${version || ''}`;
        
//   //       try {
//   //         sessionStorage.removeItem(cacheKey);
//   //         sessionStorage.removeItem(mobileCacheKey);
//   //       } catch (e) {
//   //         console.warn('Could not clear session storage cache:', e);
//   //       }
//   //     });
//   //   }
//   // }, [isMobile]); // Only run when isMobile changes
//   // Handle viewport changes - only clear cache on actual changes, not initial load
//   // useEffect(() => {
//   //   // Only process if we have a dynamicKey and mobile state is defined
//   //   if (isMobile !== undefined && dynamicKey) {
//   //     const storageKey = `mobile_state_${dynamicKey}`;
//   //     const previousMobileState = sessionStorage.getItem(storageKey);
      
//   //     console.log(`📱 [Viewport Change] isMobile: ${isMobile} for ${dynamicKey}, previous: ${previousMobileState}`);
      
//   //     // Only clear cache if this is a REAL viewport change
//   //     if (previousMobileState !== null && previousMobileState !== String(isMobile)) {
//   //       console.log(`🧹 [Cache Clear] Viewport actually changed from ${previousMobileState} to ${isMobile}, clearing cache for ${dynamicKey}`);
//   //       clearImageUrlCacheForKey(dynamicKey);
//   //     } else if (previousMobileState === null) {
//   //       console.log(`📝 [Initial Load] First time loading ${dynamicKey}, no cache clear needed`);
//   //     } else {
//   //       console.log(`⚡ [No Change] Mobile state unchanged for ${dynamicKey}, keeping cache`);
//   //     }
      
//   //     // Store current state for future comparisons
//   //     sessionStorage.setItem(storageKey, String(isMobile));
//   //   }
//   // }, [isMobile, dynamicKey]); // Include dynamicKey but only clear on real changes

//   // FIXED: Smart viewport change detection that doesn't over-clear cache
//   useEffect(() => {
//     // Only process if we have a dynamicKey and mobile state is defined
//     if (isMobile !== undefined && dynamicKey) {
//       const storageKey = `viewport_state_${dynamicKey}`;
//       const previousState = sessionStorage.getItem(storageKey);
      
//       // Parse previous state to get more context
//       let previousData = null;
//       try {
//         previousData = previousState ? JSON.parse(previousState) : null;
//       } catch (e) {
//         console.warn('Could not parse previous viewport state');
//       }
      
//       const currentData = {
//         isMobile,
//         timestamp: Date.now(),
//         viewport: { width: window.innerWidth, height: window.innerHeight }
//       };
      
//       console.log(`📱 [Viewport Check] ${dynamicKey}: isMobile=${isMobile}, previous=${previousData?.isMobile}`);
      
//       // Only clear cache if this is a SIGNIFICANT viewport change with debounce
//       if (previousData && 
//           previousData.isMobile !== isMobile && 
//           Math.abs(currentData.timestamp - previousData.timestamp) > 1000) { // 1 second debounce
        
//         console.log(`🔄 [Significant Change] Viewport change detected for ${dynamicKey}, clearing cache`);
//         // Only clear THIS image's cache with reason tracking
//         clearImageUrlCacheForKey(dynamicKey, 'significant-viewport-change');
//       } else if (previousData?.isMobile === isMobile) {
//         console.log(`⚡ [No Change] Mobile state unchanged for ${dynamicKey}, keeping cache`);
//       } else if (!previousData) {
//         console.log(`📝 [Initial Load] First time loading ${dynamicKey}, no cache clear needed`);
//       } else {
//         console.log(`⏱️ [Debounced] Change too recent for ${dynamicKey}, skipping cache clear`);
//       }
      
//       // Store current state for future comparisons
//       try {
//         sessionStorage.setItem(storageKey, JSON.stringify(currentData));
//       } catch (e) {
//         console.warn('Could not store viewport state - storage may be full');
//         // Don't fail the whole operation if storage is full
//       }
//     }
//   }, [isMobile, dynamicKey]);

//   useEffect(() => {
//     if (!dynamicKey) return;

//     // const shouldUseMobile = isMobile && mobilePreferredKeys.has(dynamicKey);
//     // const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;
//     const shouldUseMobile = isMobile && hasMobileVariant(dynamicKey);
//     const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;

//     // setState(prev => ({ ...prev, isLoading: true, error: false }));
//     // Don't start loading until mobile detection is complete (isMobile is not undefined)
//     if (isMobile === undefined) {
//       // Set initial loading state but don't fetch yet
//       setState(prev => ({ 
//         ...prev, 
//         isLoading: true, 
//         error: false,
//         dynamicSrc: null 
//       }));
//       return; // Wait for mobile detection to complete
//     }
//     // ADD THESE DEBUG LOGS HERE:
//     console.log(`🔍 [useResponsiveImage] Debug Info:`, {
//       dynamicKey,
//       isMobile,
//       hasMobileVariant: hasMobileVariant(dynamicKey),
//       shouldUseMobile,
//       effectiveKey,
//       timestamp: new Date().toISOString()
//     });

//     setState(prev => ({ ...prev, isLoading: true, error: false }));

//     // if (process.env.NODE_ENV === 'development') {
//     //   clearImageUrlCacheForKey(effectiveKey);
//     // }
//     if (process.env.NODE_ENV === 'development' && debugCache) {
//       console.log(`🔧 [Dev Mode] Debug cache enabled, clearing cache for ${effectiveKey}`);
//       clearImageUrlCacheForKey(effectiveKey);
//     }

//     // const fetchImage = async () => {
//     //   try {
//     //     const globalVersion = await getGlobalCacheVersion();
//     //     const cacheKey = `perfcache:${effectiveKey}:${size || 'original'}:${globalVersion || ''}`;
//     //     const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;

//     //     let cachedImageInfo: any = null;
//     //     const cacheExpiryTime = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType)
//     //       ? 15 * 60 * 1000
//     //       : 5 * 60 * 1000;

//     //     if (cachedData) {
//     //       try {
//     //         const parsed = JSON.parse(cachedData);
//     //         const cacheAge = Date.now() - parsed.timestamp;
//     //         if (cacheAge < cacheExpiryTime) {
//     //           cachedImageInfo = parsed;
//     //           if (debugCache) console.log(`Using cached image data for ${effectiveKey}`);
//     //         }
//     //       } catch (e) {
//     //         console.error('Error parsing cached image data:', e);
//     //       }
//     //     }

//     //     let tinyPlaceholder = null;
//     //     let colorPlaceholder = null;

//     //     if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
//     //       const placeholders = await getImagePlaceholdersByKey(effectiveKey);
//     //       tinyPlaceholder = placeholders.tinyPlaceholder;
//     //       colorPlaceholder = placeholders.colorPlaceholder;

//     //       if (tinyPlaceholder) {
//     //         setState(prev => ({
//     //           ...prev,
//     //           tinyPlaceholder,
//     //           colorPlaceholder,
//     //         }));
//     //       }
//     //     }

//     //     if (cachedImageInfo) {
//     //       setState(prev => ({
//     //         ...prev,
//     //         dynamicSrc: cachedImageInfo.url,
//     //         isLoading: false,
//     //         aspectRatio: cachedImageInfo.aspectRatio,
//     //         tinyPlaceholder: cachedImageInfo.tinyPlaceholder || prev.tinyPlaceholder,
//     //         colorPlaceholder: cachedImageInfo.colorPlaceholder || prev.colorPlaceholder,
//     //         contentHash: cachedImageInfo.contentHash,
//     //         isCached: true,
//     //         lastUpdated: cachedImageInfo.lastUpdated
//     //       }));
//     //       return;
//     //     }

//     //     if (debugCache) console.log(`Fetching image with key: ${effectiveKey}, size: ${size || 'original'}`);

//     //     const placeholdersPromise = !tinyPlaceholder ? getImagePlaceholdersByKey(effectiveKey) : Promise.resolve({ tinyPlaceholder, colorPlaceholder });

//     //     let imageUrl: string;
//     //     let extractedContentHash = null;

//     //     if (size) {
//     //       imageUrl = await getImageUrlByKeyAndSize(effectiveKey, size);
//     //     } else {
//     //       imageUrl = await getImageUrlByKey(effectiveKey);
//     //     }

//     //     try {
//     //       const urlObj = new URL(imageUrl);
//     //       extractedContentHash = urlObj.searchParams.get('v') || null;
//     //     } catch (err) {}

//     //     const { tinyPlaceholder: tp, colorPlaceholder: cp } = await placeholdersPromise;
//     //     tinyPlaceholder = tinyPlaceholder || tp;
//     //     colorPlaceholder = colorPlaceholder || cp;

//     //     const aspectRatio = await getImageAspectRatio(imageUrl);

//     //     const imageInfo = {
//     //       url: imageUrl,
//     //       aspectRatio,
//     //       tinyPlaceholder,
//     //       colorPlaceholder,
//     //       contentHash: extractedContentHash,
//     //       timestamp: Date.now(),
//     //       lastUpdated: new Date().toISOString(),
//     //       globalVersion,
//     //       networkType: network.effectiveConnectionType
//     //     };

//     //     try {
//     //       if (navigator.onLine) {
//     //         sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
//     //       }
//     //     } catch (e) {
//     //       console.warn('Failed to cache image data in sessionStorage:', e);
//     //     }

//     //     setState(prev => ({
//     //       ...prev,
//     //       dynamicSrc: imageUrl,
//     //       isLoading: false,
//     //       aspectRatio,
//     //       tinyPlaceholder,
//     //       colorPlaceholder,
//     //       contentHash: extractedContentHash,
//     //       isCached: false,
//     //       lastUpdated: imageInfo.lastUpdated
//     //     }));
//     //   } catch (error) {
//     //     console.error(`Failed to load image with key ${dynamicKey}:`, error);
//     //     setState(prev => ({ ...prev, error: true, isLoading: false }));

//     //     if (!['hero-', 'pricing-', 'process-', 'experience-'].some(k => dynamicKey?.includes(k))) {
//     //       toast.error(`Failed to load image: ${dynamicKey}`, {
//     //         description: "Please check if this image exists in your storage.",
//     //         duration: 3000,
//     //       });
//     //     }
//     //   }
//     // };
//       const fetchImage = async () => {
//       // ADD PERFORMANCE TIMING:
//       const startTime = performance.now();
//       console.log(`⏱️ [Performance] Starting fetch for ${effectiveKey} at ${startTime}ms`);

//       // ADD THIS DEBUG LOG:
//       console.log(`🚀 [fetchImage] Starting fetch for:`, {
//         originalKey: dynamicKey,
//         effectiveKey,
//         isMobile,
//         size: size || 'original',
//         timestamp: new Date().toISOString()
//       });

//       // try {
//       //   const globalVersion = await getGlobalCacheVersion();
//       //   const cacheKey = `perfcache:${effectiveKey}:${size || 'original'}:${globalVersion || ''}`;
        
//       //   // TIMING: Cache check
//       //   const cacheCheckTime = performance.now();
//       //   console.log(`⏱️ [Performance] Cache check completed at ${cacheCheckTime - startTime}ms`);
        
//       //   const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;

//       //   // let cachedImageInfo: any = null;
//       //   // const cacheExpiryTime = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType)
//       //   //   ? 15 * 60 * 1000
//       //   //   : 5 * 60 * 1000;
//       //   let cachedImageInfo: any = null;
//       //   // FIXED: Don't penalize 3G networks - only truly slow connections get longer cache
//       //   const cacheExpiryTime = ['slow-2g', '2g'].includes(network.effectiveConnectionType)
//       //     ? 15 * 60 * 1000  // 15 minutes for truly slow connections
//       //     : 5 * 60 * 1000;  // 5 minutes for 3G, 4G, and unknown connections

//       //   if (cachedData) {
//       //     try {
//       //       const parsed = JSON.parse(cachedData);
//       //       const cacheAge = Date.now() - parsed.timestamp;
//       //       if (cacheAge < cacheExpiryTime) {
//       //         cachedImageInfo = parsed;
//       //         if (debugCache) console.log(`Using cached image data for ${effectiveKey}`);
//       //       }
//       //     } catch (e) {
//       //       console.error('Error parsing cached image data:', e);
//       //     }
//       //   }

//       //   let tinyPlaceholder = null;
//       //   let colorPlaceholder = null;

//       //   if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
//       //     const placeholders = await getImagePlaceholdersByKey(effectiveKey);
//       //     tinyPlaceholder = placeholders.tinyPlaceholder;
//       //     colorPlaceholder = placeholders.colorPlaceholder;

//       //     if (tinyPlaceholder) {
//       //       setState(prev => ({
//       //         ...prev,
//       //         tinyPlaceholder,
//       //         colorPlaceholder,
//       //       }));
//       //     }
//       //   }

//       //   if (cachedImageInfo) {
//       //     const cacheHitTime = performance.now();
//       //     console.log(`⏱️ [Performance] Cache HIT! Total time: ${cacheHitTime - startTime}ms`);
          
//       //     setState(prev => ({
//       //       ...prev,
//       //       dynamicSrc: cachedImageInfo.url,
//       //       isLoading: false,
//       //       aspectRatio: cachedImageInfo.aspectRatio,
//       //       tinyPlaceholder: cachedImageInfo.tinyPlaceholder || prev.tinyPlaceholder,
//       //       colorPlaceholder: cachedImageInfo.colorPlaceholder || prev.colorPlaceholder,
//       //       contentHash: cachedImageInfo.contentHash,
//       //       isCached: true,
//       //       lastUpdated: cachedImageInfo.lastUpdated
//       //     }));
//       //     return;
//       //   }

//       //   // TIMING: Network request start
//       //   const networkStartTime = performance.now();
//       //   console.log(`⏱️ [Performance] Starting network request at ${networkStartTime - startTime}ms`);

//       //   if (debugCache) console.log(`Fetching image with key: ${effectiveKey}, size: ${size || 'original'}`);

//       //   const placeholdersPromise = !tinyPlaceholder ? getImagePlaceholdersByKey(effectiveKey) : Promise.resolve({ tinyPlaceholder, colorPlaceholder });

//       //   let imageUrl: string;
//       //   let extractedContentHash = null;

//       //   if (size) {
//       //     imageUrl = await getImageUrlByKeyAndSize(effectiveKey, size);
//       //   } else {
//       //     imageUrl = await getImageUrlByKey(effectiveKey);
//       //   }

//       //   // TIMING: URL fetched
//       //   const urlFetchTime = performance.now();
//       //   console.log(`⏱️ [Performance] URL fetched at ${urlFetchTime - startTime}ms: ${imageUrl}`);

//       //   try {
//       //     const urlObj = new URL(imageUrl);
//       //     extractedContentHash = urlObj.searchParams.get('v') || null;
//       //   } catch (err) {}

//       //   const { tinyPlaceholder: tp, colorPlaceholder: cp } = await placeholdersPromise;
//       //   tinyPlaceholder = tinyPlaceholder || tp;
//       //   colorPlaceholder = colorPlaceholder || cp;

//       //   const aspectRatio = await getImageAspectRatio(imageUrl);

//       //   const imageInfo = {
//       //     url: imageUrl,
//       //     aspectRatio,
//       //     tinyPlaceholder,
//       //     colorPlaceholder,
//       //     contentHash: extractedContentHash,
//       //     timestamp: Date.now(),
//       //     lastUpdated: new Date().toISOString(),
//       //     globalVersion,
//       //     networkType: network.effectiveConnectionType
//       //   };

//       //   try {
//       //     if (navigator.onLine) {
//       //       sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
//       //     }
//       //   } catch (e) {
//       //     console.warn('Failed to cache image data in sessionStorage:', e);
//       //   }

//       //   // ADD THIS DEBUG LOG BEFORE THE FINAL setState:
//       //   console.log(`✅ [fetchImage] About to set final state:`, {
//       //     originalKey: dynamicKey,
//       //     effectiveKey,
//       //     imageUrl,
//       //     isMobile,
//       //     timestamp: new Date().toISOString()
//       //   });

//       //   // TIMING: Complete
//       //   const completeTime = performance.now();
//       //   console.log(`⏱️ [Performance] COMPLETE! Total time: ${completeTime - startTime}ms for ${effectiveKey}`);

//       //   setState(prev => ({
//       //     ...prev,
//       //     dynamicSrc: imageUrl,
//       //     isLoading: false,
//       //     aspectRatio,
//       //     tinyPlaceholder,
//       //     colorPlaceholder,
//       //     contentHash: extractedContentHash,
//       //     isCached: false,
//       //     lastUpdated: imageInfo.lastUpdated
//       //   }));
//       // } catch (error) {
//       //   const errorTime = performance.now();
//       //   console.log(`⏱️ [Performance] ERROR at ${errorTime - startTime}ms:`, error);
        
//       //   console.error(`Failed to load image with key ${dynamicKey}:`, error);
//       //   setState(prev => ({ ...prev, error: true, isLoading: false }));

//       //   if (!['hero-', 'pricing-', 'process-', 'experience-'].some(k => dynamicKey?.includes(k))) {
//       //     toast.error(`Failed to load image: ${dynamicKey}`, {
//       //       description: "Please check if this image exists in your storage.",
//       //       duration: 3000,
//       //     });
//       //   }
//       // }

//       // FIXED: Add retry logic with intelligent backoff for mobile networks
//       const fetchImageWithRetry = async (retryCount = 0, maxRetries = 3): Promise<void> => {
//         try {
//           // const globalVersion = await getGlobalCacheVersion();
//           // const cacheKey = `perfcache:${effectiveKey}:${size || 'original'}:${globalVersion || ''}`;
//           const globalVersion = await getGlobalCacheVersion();
    
//           // 🎯 MOBILE-SPECIFIC CACHE KEYS
//           const deviceType = isMobile ? 'mobile' : 'desktop';
//           const cacheKey = `perfcache:${effectiveKey}:${deviceType}:${size || 'original'}:${globalVersion || ''}`;
          
//           // TIMING: Cache check
//           const cacheCheckTime = performance.now();
//           console.log(`⏱️ [Performance] Cache check completed at ${cacheCheckTime - startTime}ms`);
          
//           // const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;
//           const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;

//           let cachedImageInfo: any = null;
//           // FIXED: Don't penalize 3G networks - only truly slow connections get longer cache
//           const cacheExpiryTime = ['slow-2g', '2g'].includes(network.effectiveConnectionType)
//             ? 15 * 60 * 1000  // 15 minutes for truly slow connections
//             : 5 * 60 * 1000;  // 5 minutes for 3G, 4G, and unknown connections

//           if (cachedData) {
//             try {
//               const parsed = JSON.parse(cachedData);
//               const cacheAge = Date.now() - parsed.timestamp;
//               if (cacheAge < cacheExpiryTime) {
//                 cachedImageInfo = parsed;
//                 if (debugCache) console.log(`Using cached image data for ${effectiveKey}`);
//               }
//             } catch (e) {
//               console.error('Error parsing cached image data:', e);
//             }
//           }

//           let tinyPlaceholder = null;
//           let colorPlaceholder = null;

//           if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
//             const placeholders = await getImagePlaceholdersByKey(effectiveKey);
//             tinyPlaceholder = placeholders.tinyPlaceholder;
//             colorPlaceholder = placeholders.colorPlaceholder;

//             if (tinyPlaceholder) {
//               setState(prev => ({
//                 ...prev,
//                 tinyPlaceholder,
//                 colorPlaceholder,
//               }));
//             }
//           }

//           if (cachedImageInfo) {
//             const cacheHitTime = performance.now();
//             console.log(`⏱️ [Performance] Cache HIT! Total time: ${cacheHitTime - startTime}ms`);
            
//             setState(prev => ({
//               ...prev,
//               dynamicSrc: cachedImageInfo.url,
//               isLoading: false,
//               aspectRatio: cachedImageInfo.aspectRatio,
//               tinyPlaceholder: cachedImageInfo.tinyPlaceholder || prev.tinyPlaceholder,
//               colorPlaceholder: cachedImageInfo.colorPlaceholder || prev.colorPlaceholder,
//               contentHash: cachedImageInfo.contentHash,
//               isCached: true,
//               lastUpdated: cachedImageInfo.lastUpdated
//             }));
//             return;
//           }

//           // TIMING: Network request start
//           const networkStartTime = performance.now();
//           console.log(`⏱️ [Performance] Starting network request at ${networkStartTime - startTime}ms (attempt ${retryCount + 1})`);

//           if (debugCache) console.log(`Fetching image with key: ${effectiveKey}, size: ${size || 'original'}`);

//           const placeholdersPromise = !tinyPlaceholder ? getImagePlaceholdersByKey(effectiveKey) : Promise.resolve({ tinyPlaceholder, colorPlaceholder });

//           let imageUrl: string;
//           let extractedContentHash = null;

//           // 🎯 MOBILE-AWARE IMAGE URL FETCHING
//         if (size) {
//           // For sized images, prefer mobile versions on mobile devices
//           const mobileSize = isMobile && size === 'large' ? 'medium' : size;
//           imageUrl = await getImageUrlByKeyAndSize(effectiveKey, mobileSize);
//         } else {
//           imageUrl = await getImageUrlByKey(effectiveKey);
//         }
        
//         console.log(`📱 Fetched ${isMobile ? 'MOBILE' : 'DESKTOP'} URL for ${effectiveKey}: ${imageUrl.substring(0, 60)}...`);

//           // TIMING: URL fetched
//           const urlFetchTime = performance.now();
//           console.log(`⏱️ [Performance] URL fetched at ${urlFetchTime - startTime}ms: ${imageUrl}`);

//           try {
//             const urlObj = new URL(imageUrl);
//             extractedContentHash = urlObj.searchParams.get('v') || null;
//           } catch (err) {}

//           const { tinyPlaceholder: tp, colorPlaceholder: cp } = await placeholdersPromise;
//           tinyPlaceholder = tinyPlaceholder || tp;
//           colorPlaceholder = colorPlaceholder || cp;

//           const aspectRatio = await getImageAspectRatio(imageUrl);

//           const imageInfo = {
//           url: imageUrl,
//           aspectRatio,
//           tinyPlaceholder,
//           colorPlaceholder,
//           contentHash: extractedContentHash,
//           timestamp: Date.now(),
//           lastUpdated: new Date().toISOString(),
//           globalVersion,
//           networkType: network.effectiveConnectionType,
//           // 🎯 ADD DEVICE TYPE FOR CACHE VALIDATION
//           deviceType: isMobile ? 'mobile' : 'desktop',
//           estimatedSize: isMobile ? '~200KB' : '~800KB'
//         };

//           // try {
//           //   if (navigator.onLine) {
//           //     sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
//           //   }
//           // } catch (e) {
//           //   console.warn('Failed to cache image data in sessionStorage:', e);
//           // }
//           // FIXED: Use robust caching with fallback
//           // FIXED: Use robust caching with fallback and device awareness
//         cacheImageInfo(cacheKey, imageInfo);
        
//         console.log(`💾 Cached ${deviceType} image info for ${effectiveKey}`);

//           console.log(`✅ [fetchImage] About to set final state:`, {
//             originalKey: dynamicKey,
//             effectiveKey,
//             imageUrl,
//             isMobile,
//             timestamp: new Date().toISOString()
//           });

//           // TIMING: Complete
//           const completeTime = performance.now();
//           console.log(`⏱️ [Performance] COMPLETE! Total time: ${completeTime - startTime}ms for ${effectiveKey}`);

//           setState(prev => ({
//             ...prev,
//             dynamicSrc: imageUrl,
//             isLoading: false,
//             aspectRatio,
//             tinyPlaceholder,
//             colorPlaceholder,
//             contentHash: extractedContentHash,
//             isCached: false,
//             lastUpdated: imageInfo.lastUpdated
//           }));

//         } catch (error) {
//           const errorTime = performance.now();
//           console.error(`❌ [Retry ${retryCount + 1}/${maxRetries + 1}] Error at ${errorTime - startTime}ms for ${effectiveKey}:`, error);
          
//           // Determine if we should retry based on error type and network
//           const isNetworkError = error instanceof TypeError || 
//                                 error.message?.includes('fetch') || 
//                                 error.message?.includes('network') ||
//                                 error.name === 'NetworkError';
          
//           const shouldRetry = retryCount < maxRetries && 
//                              isNetworkError && 
//                              navigator.onLine;
          
//           if (shouldRetry) {
//             // Smart backoff - shorter delays on mobile networks to prevent long waits
//             const isMobileNetwork = ['3g', '4g'].includes(network.effectiveConnectionType);
//             const baseDelay = isMobileNetwork ? 500 : 1000; // Shorter delays for mobile
//             const delay = baseDelay * Math.pow(1.5, retryCount); // Gentler exponential backoff
            
//             console.log(`🔄 [Retry] Retrying ${effectiveKey} in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            
//             await new Promise(resolve => setTimeout(resolve, delay));
//             return fetchImageWithRetry(retryCount + 1, maxRetries);
//           }
          
//           // Final failure after all retries
//           console.error(`💥 [Final Failure] Failed to load image ${dynamicKey} after ${retryCount + 1} attempts:`, error);
//           setState(prev => ({ ...prev, error: true, isLoading: false }));

//           if (!['hero-', 'pricing-', 'process-', 'experience-'].some(k => dynamicKey?.includes(k))) {
//             toast.error(`Failed to load image: ${dynamicKey}`, {
//               description: `Network error after ${retryCount + 1} attempts. Please check your connection.`,
//               duration: 3000,
//             });
//           }
//         }
//       };

//       // Start the fetch with retry logic
//       await fetchImageWithRetry();
//     };
//     // const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)
//     //   ? 300 : 0;
//     // ADD PRIORITY LOGIC FOR HERO IMAGE:
//     // const isHeroImage = dynamicKey?.includes('hero-background');
//     // const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)
//     //   ? (isHeroImage ? 0 : 300)  // No delay for hero images
//     //   : (isHeroImage ? 0 : 100); // Small delay for non-hero to prioritize hero

//     // console.log(`🚀 [Priority] ${effectiveKey} is hero: ${isHeroImage}, delay: ${delay}ms`);
//     // FIXED: Remove arbitrary delays and prioritize based on image importance
//     const isHeroImage = dynamicKey?.includes('hero-background');
//     const isCriticalImage = isHeroImage || dynamicKey?.includes('hero-') || 
//                            dynamicKey?.includes('pricing-hero') || 
//                            dynamicKey?.includes('experience-hero');
    
//     // Only delay on truly slow connections, and only for non-critical images
//     const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)
//       ? (isCriticalImage ? 0 : 200)  // Reduced delay for non-critical images
//       : 0; // No delays for 3G and above

//     console.log(`🚀 [Priority] ${effectiveKey} is critical: ${isCriticalImage}, connection: ${network.effectiveConnectionType}, delay: ${delay}ms`);

//     const timeoutId = setTimeout(fetchImage, delay);
//     return () => clearTimeout(timeoutId);
//   }, [dynamicKey, size, debugCache, network.online, network.effectiveConnectionType, isMobile]);

//   return state;
// };

// const getImageAspectRatio = (url: string): Promise<number | undefined> => {
//   return new Promise(resolve => {
//     if (url === '/placeholder.svg') {
//       resolve(16 / 9);
//       return;
//     }

//     const img = new Image();
//     img.onload = () => resolve(img.width / img.height);
//     img.onerror = () => resolve(undefined);
//     img.src = url;
//   });
// };

import { useState, useEffect, useCallback, useRef } from 'react';
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

// Enhanced memory cache with better performance
const memoryCache = new Map<string, { 
  data: any; 
  timestamp: number; 
  ttl: number; 
  accessCount: number; 
}>();

// Optimized cache cleanup - runs less frequently
const cleanMemoryCache = () => {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.timestamp + entry.ttl) {
      memoryCache.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`🧹 [Memory Cache] Cleaned ${cleaned} expired entries`);
  }
};

// Reduced cleanup frequency for better performance
setInterval(cleanMemoryCache, 10 * 60 * 1000); // Every 10 minutes

// Enhanced caching with access tracking
const cacheImageInfo = (cacheKey: string, imageInfo: any): void => {
  try {
    if (navigator.onLine) {
      sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
    }
  } catch (storageError) {
    // Fallback to memory cache with access tracking
    memoryCache.set(cacheKey, {
      data: imageInfo,
      timestamp: Date.now(),
      ttl: 10 * 60 * 1000,
      accessCount: 1
    });
  }
};

const getCachedImageInfo = (cacheKey: string): any | null => {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // Silent fallback to memory cache
  }
  
  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry && Date.now() <= memoryEntry.timestamp + memoryEntry.ttl) {
    memoryEntry.accessCount++; // Track access for LRU
    return memoryEntry.data;
  }
  
  return null;
};

// Smart mobile variant detection
const hasMobileVariant = (key: string): boolean => {
  const mobilePatterns = [
    'hero-background', 'pricing-hero', 'process-hero', 'experience-hero',
    'villalab-', 'tribe-', 'depth-', 'experience-'
  ];
  
  return mobilePatterns.some(pattern => key.startsWith(pattern) || key.includes(pattern));
};

// Critical image priorities
const CRITICAL_IMAGES = new Set([
  'hero-background',
  'hero-background-mobile',
  'pricing-hero',
  'experience-hero'
]);

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
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Optimized state updater that checks if component is still mounted
  const updateState = useCallback((updater: (prev: ImageLoadingState) => ImageLoadingState) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  }, []);

  // Smart viewport change detection with debouncing
  useEffect(() => {
    if (isMobile !== undefined && dynamicKey) {
      const storageKey = `viewport_state_${dynamicKey}`;
      const previousState = sessionStorage.getItem(storageKey);
      
      let previousData = null;
      try {
        previousData = previousState ? JSON.parse(previousState) : null;
      } catch (e) {
        // Ignore parsing errors
      }
      
      const currentData = {
        isMobile,
        timestamp: Date.now(),
        viewport: { width: window.innerWidth, height: window.innerHeight }
      };
      
      // Only clear cache for significant viewport changes with debounce
      if (previousData && 
          previousData.isMobile !== isMobile && 
          Math.abs(currentData.timestamp - previousData.timestamp) > 1000) {
        
        console.log(`🔄 [Viewport] Significant change for ${dynamicKey}, clearing cache`);
        clearImageUrlCacheForKey(dynamicKey, 'viewport-change');
      }
      
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(currentData));
      } catch (e) {
        // Storage may be full, continue silently
      }
    }
  }, [isMobile, dynamicKey]);

  // Enhanced image fetching with better error handling and performance
  useEffect(() => {
    if (!dynamicKey) return;

    // Wait for mobile detection to complete
    if (isMobile === undefined) {
      updateState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: false,
        dynamicSrc: null 
      }));
      return;
    }

    // Determine effective key
    const shouldUseMobile = isMobile && hasMobileVariant(dynamicKey);
    const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;
    const isCritical = CRITICAL_IMAGES.has(dynamicKey);

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    updateState(prev => ({ ...prev, isLoading: true, error: false }));

    // Clear cache in development when debug is enabled
    if (process.env.NODE_ENV === 'development' && debugCache) {
      clearImageUrlCacheForKey(effectiveKey);
    }

    const fetchImageWithOptimization = async (): Promise<void> => {
      const startTime = performance.now();
      
      try {
        const globalVersion = await getGlobalCacheVersion();
        const deviceType = isMobile ? 'mobile' : 'desktop';
        const cacheKey = `perfcache:${effectiveKey}:${deviceType}:${size || 'original'}:${globalVersion || ''}`;
        
        // Check cache first
        const cachedImageInfo = getCachedImageInfo(cacheKey);
        
        // Enhanced cache expiry based on connection and image criticality
        const cacheExpiryTime = (() => {
          if (isCritical) return 30 * 60 * 1000; // 30 minutes for critical images
          if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
            return 20 * 60 * 1000; // 20 minutes for slow connections
          }
          return 10 * 60 * 1000; // 10 minutes for good connections
        })();

        if (cachedImageInfo) {
          const cacheAge = Date.now() - cachedImageInfo.timestamp;
          if (cacheAge < cacheExpiryTime) {
            const cacheHitTime = performance.now();
            console.log(`⚡ [Cache HIT] ${effectiveKey} loaded in ${(cacheHitTime - startTime).toFixed(1)}ms`);
            
            updateState(prev => ({
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
        }

        // Load placeholders for slow connections (non-blocking)
        let tinyPlaceholder = null;
        let colorPlaceholder = null;

        if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
          try {
            const placeholders = await getImagePlaceholdersByKey(effectiveKey);
            tinyPlaceholder = placeholders.tinyPlaceholder;
            colorPlaceholder = placeholders.colorPlaceholder;

            if (tinyPlaceholder && isMountedRef.current) {
              updateState(prev => ({
                ...prev,
                tinyPlaceholder,
                colorPlaceholder,
              }));
            }
          } catch (placeholderError) {
            // Non-critical, continue without placeholders
            console.warn(`📸 [Placeholder] Failed to load for ${effectiveKey}:`, placeholderError);
          }
        }

        // Fetch main image URL
        let imageUrl: string;
        if (size) {
          const optimizedSize = isMobile && size === 'large' ? 'medium' : size;
          imageUrl = await getImageUrlByKeyAndSize(effectiveKey, optimizedSize);
        } else {
          imageUrl = await getImageUrlByKey(effectiveKey);
        }

        // Extract content hash
        let extractedContentHash = null;
        try {
          const urlObj = new URL(imageUrl);
          extractedContentHash = urlObj.searchParams.get('v') || null;
        } catch (err) {
          // URL parsing failed, continue without hash
        }

        // Get aspect ratio
        const aspectRatio = await getImageAspectRatio(imageUrl);

        // Prepare cache data
        const imageInfo = {
          url: imageUrl,
          aspectRatio,
          tinyPlaceholder,
          colorPlaceholder,
          contentHash: extractedContentHash,
          timestamp: Date.now(),
          lastUpdated: new Date().toISOString(),
          globalVersion,
          networkType: network.effectiveConnectionType,
          deviceType: isMobile ? 'mobile' : 'desktop',
          isCritical
        };

        // Cache the result
        cacheImageInfo(cacheKey, imageInfo);

        const completeTime = performance.now();
        console.log(`✅ [Network] ${effectiveKey} loaded in ${(completeTime - startTime).toFixed(1)}ms`);

        // Update state if component is still mounted
        if (isMountedRef.current) {
          updateState(prev => ({
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
        }

      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(`🚫 [Aborted] Request for ${effectiveKey} was cancelled`);
          return;
        }

        const errorTime = performance.now();
        console.error(`❌ [Error] ${effectiveKey} failed after ${(errorTime - startTime).toFixed(1)}ms:`, error);
        
        if (isMountedRef.current) {
          updateState(prev => ({ ...prev, error: true, isLoading: false }));

          // Only show toast for non-hero images to avoid spam
          if (!CRITICAL_IMAGES.has(dynamicKey)) {
            toast.error(`Failed to load image: ${dynamicKey}`, {
              description: "Please check your connection and try again.",
              duration: 3000,
            });
          }
        }
      }
    };

    // Smart loading delays based on image priority
    const delay = (() => {
      if (isCritical) return 0; // No delay for critical images
      if (!navigator.onLine) return 500; // Longer delay when offline
      if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
        return 100; // Short delay for slow connections
      }
      return 0; // No delay for good connections
    })();

    const timeoutId = setTimeout(fetchImageWithOptimization, delay);
    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [dynamicKey, size, debugCache, network.online, network.effectiveConnectionType, isMobile, updateState]);

  return state;
};

// Optimized aspect ratio calculation with caching
const aspectRatioCache = new Map<string, number>();

const getImageAspectRatio = (url: string): Promise<number | undefined> => {
  return new Promise(resolve => {
    if (url === '/placeholder.svg') {
      resolve(16 / 9);
      return;
    }

    // Check cache first
    if (aspectRatioCache.has(url)) {
      resolve(aspectRatioCache.get(url));
      return;
    }

    const img = new Image();
    const timeout = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      resolve(undefined);
    }, 5000); // 5 second timeout

    img.onload = () => {
      clearTimeout(timeout);
      const ratio = img.width / img.height;
      aspectRatioCache.set(url, ratio);
      resolve(ratio);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(undefined);
    };
    
    img.src = url;
  });
};